import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { relative, resolve } from 'node:path'
import { marked } from 'marked'
import { INVENTORY, type InventoryItem, type Priority } from '../inventory/inventory'

const ROOT = resolve(import.meta.dirname, '..')
const OUT = resolve(ROOT, 'qa-output')
const RESULTS = resolve(OUT, 'results.json')
const TRIAGE = resolve(ROOT, 'triage/notes.json')

interface Annotation {
  type: string
  description?: string
}
interface Attachment {
  name: string
  path?: string
  contentType: string
}
interface Result {
  status: string
  retry: number
  duration: number
  errors?: { message?: string }[]
  error?: { message?: string }
  attachments: Attachment[]
  annotations?: Annotation[]
}
interface PwTest {
  projectName: string
  status: 'expected' | 'unexpected' | 'flaky' | 'skipped'
  annotations: Annotation[]
  results: Result[]
}
interface Spec {
  title: string
  file: string
  line: number
  tests: PwTest[]
}
interface Suite {
  title: string
  file: string
  specs: Spec[]
  suites?: Suite[]
}

interface Note {
  title?: string
  severity?: Priority
  verdict?: 'bug' | 'not-a-bug' | 'environment' | 'flaky'
  steps?: string[]
  expected?: string
  actual?: string
  rootCause?: string
  fix?: string
  regression?: string
}

interface Finding {
  id: string
  severity: Priority
  title: string
  detail: string
  page?: string
  viewport?: string
}

interface Row {
  title: string
  file: string
  line: number
  project: string
  status: PwTest['status']
  inventory: string[]
  findings: Finding[]
  unverified: { id: string; reason: string }[]
  error: string
  attachments: Attachment[]
  runtime: string[]
}

const strip = (s = '') => s.replace(/\u001b\[[0-9;]*m/g, '')
const md = (s: string) => s.replace(/\|/g, '\\|').replace(/\n/g, '<br>')
const rel = (p?: string) => (p ? relative(OUT, p).replace(/\\/g, '/') : '')

if (!existsSync(RESULTS)) {
  console.error(`No results at ${RESULTS}. Run "npm run qa" first.`)
  process.exit(1)
}

const report = JSON.parse(readFileSync(RESULTS, 'utf8')) as {
  suites: Suite[]
  stats: { startTime: string; duration: number }
}
const notes: Record<string, Note> = existsSync(TRIAGE)
  ? JSON.parse(readFileSync(TRIAGE, 'utf8'))
  : {}

const rows: Row[] = []
const walk = (suite: Suite, prefix: string[]) => {
  for (const spec of suite.specs ?? []) {
    for (const t of spec.tests) {
      const anns = [...t.annotations, ...t.results.flatMap((r) => r.annotations ?? [])]
      const last = t.results.at(-1)
      const firstFail = t.results.find((r) => r.status !== 'passed' && r.status !== 'skipped')
      const runtimeAtt = (last?.attachments ?? []).find((a) => a.name === 'runtime-events.json')
      rows.push({
        title: [...prefix, spec.title].filter(Boolean).join(' › '),
        file: spec.file,
        line: spec.line,
        project: t.projectName,
        status: t.status,
        inventory: [
          ...new Set(anns.filter((a) => a.type === 'inventory').map((a) => a.description!)),
        ],
        findings: [
          ...new Map(
            anns
              .filter((a) => a.type === 'finding')
              .map((a) => JSON.parse(a.description!) as Finding)
              .map((f) => [f.id, f]),
          ).values(),
        ],
        unverified: [
          ...new Map(
            anns
              .filter((a) => a.type === 'unverified')
              .map((a) => JSON.parse(a.description!))
              .map((u) => [u.reason, u]),
          ).values(),
        ],
        error: strip(
          firstFail?.errors?.map((e) => e.message).join('\n') ?? firstFail?.error?.message ?? '',
        ),
        attachments: [...(firstFail?.attachments ?? []), ...(last?.attachments ?? [])].filter(
          (a) => a.path,
        ),
        runtime:
          runtimeAtt?.path && existsSync(runtimeAtt.path)
            ? (
                JSON.parse(readFileSync(runtimeAtt.path, 'utf8')) as {
                  kind: string
                  text: string
                  url?: string
                }[]
              )
                .filter((e) => e.kind !== 'http-error' || !/\/api\//.test(e.url ?? ''))
                .map((e) => `${e.kind}: ${e.text}${e.url ? ` (${e.url})` : ''}`)
            : [],
      })
    }
  }
  for (const s of suite.suites ?? []) walk(s, [...prefix, s.title])
}
for (const s of report.suites) walk(s, [])

const counts = { passed: 0, failed: 0, flaky: 0, skipped: 0 }
for (const r of rows) {
  if (r.status === 'expected') counts.passed++
  else if (r.status === 'unexpected') counts.failed++
  else if (r.status === 'flaky') counts.flaky++
  else counts.skipped++
}

type ItemStatus = 'passed' | 'failed' | 'flaky' | 'skipped' | 'unverified' | 'not covered'
const itemStatus = new Map<string, { status: ItemStatus; projects: Set<string>; rows: Row[] }>()
for (const item of INVENTORY)
  itemStatus.set(item.id, { status: 'not covered', projects: new Set(), rows: [] })
const unverifiedIds = new Map<string, string[]>()
for (const r of rows) {
  for (const u of r.unverified)
    unverifiedIds.set(u.id, [...(unverifiedIds.get(u.id) ?? []), u.reason])
  for (const id of r.inventory) {
    const s = itemStatus.get(id)
    if (!s) continue
    s.rows.push(r)
    s.projects.add(r.project)
  }
}
for (const [id, s] of itemStatus) {
  const st = s.rows.map((r) => r.status)
  if (!st.length) s.status = unverifiedIds.has(id) ? 'unverified' : 'not covered'
  else if (st.includes('unexpected')) s.status = 'failed'
  else if (st.includes('flaky')) s.status = 'flaky'
  else if (st.every((x) => x === 'skipped'))
    s.status = unverifiedIds.has(id) ? 'unverified' : 'skipped'
  else s.status = 'passed'
}

const itemCounts: Record<ItemStatus, number> = {
  passed: 0,
  failed: 0,
  flaky: 0,
  skipped: 0,
  unverified: 0,
  'not covered': 0,
}
for (const s of itemStatus.values()) itemCounts[s.status]++
const checked = itemCounts.passed + itemCounts.failed + itemCounts.flaky
const coverage = Math.round((checked / INVENTORY.length) * 1000) / 10

const rank: Record<Priority, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 }

interface Bug {
  key: string
  title: string
  severity: Priority
  pages: Set<string>
  viewports: Set<string>
  source: 'failed test' | 'finding'
  error: string
  detail: string
  evidence: string[]
  runtime: string[]
  tests: string[]
  note?: Note
}

const bugs = new Map<string, Bug>()
const pageOf = (inv: InventoryItem | undefined) => inv?.page ?? ''
for (const r of rows.filter((x) => x.status === 'unexpected' || x.status === 'flaky')) {
  const inv = r.inventory
    .map((id) => INVENTORY.find((i) => i.id === id))
    .filter(Boolean) as InventoryItem[]
  const key = inv[0]?.id ?? r.title
  const note = notes[key]
  if (note?.verdict === 'not-a-bug' || (note?.verdict === 'flaky' && r.status === 'flaky')) continue
  const b = bugs.get(key) ?? {
    key,
    title: note?.title ?? `${inv[0]?.title ?? r.title}`,
    severity: note?.severity ?? inv[0]?.priority ?? 'Medium',
    pages: new Set<string>(),
    viewports: new Set<string>(),
    source: 'failed test' as const,
    error: r.error,
    detail: '',
    evidence: [],
    runtime: [],
    tests: [],
    note,
  }
  b.pages.add(pageOf(inv[0]) || r.title.split(' ')[0])
  b.viewports.add(r.project)
  b.tests.push(
    `${r.file}:${r.line} — ${r.title} [${r.project}]${r.status === 'flaky' ? ' (flaky: passed on retry)' : ''}`,
  )
  b.evidence.push(
    ...r.attachments
      .filter((a) => /\.(png|zip|webm)$/.test(a.path!) || a.name === 'trace')
      .map((a) => rel(a.path))
      .slice(0, 4),
  )
  b.runtime.push(...r.runtime.slice(0, 5))
  bugs.set(key, b)
}
for (const r of rows) {
  for (const f of r.findings) {
    const base = f.id.replace(
      /-(home|explore|stays|stay-real|stay-sample|experiences|services|become-host|become-provider|guest-pin)$/,
      '',
    )
    const key = notes[f.id] ? f.id : notes[base] ? base : f.id
    const note = notes[key]
    if (note?.verdict === 'not-a-bug') continue
    const b = bugs.get(key) ?? {
      key,
      title: note?.title ?? f.title,
      severity: note?.severity ?? f.severity,
      pages: new Set<string>(),
      viewports: new Set<string>(),
      source: 'finding' as const,
      error: '',
      detail: f.detail,
      evidence: [],
      runtime: [],
      tests: [],
      note,
    }
    if (f.page) b.pages.add(f.page)
    b.viewports.add(f.viewport ?? r.project)
    if (!b.detail.includes(f.detail)) b.detail = [b.detail, f.detail].filter(Boolean).join('\n')
    b.tests.push(`${r.file}:${r.line} — ${r.title} [${r.project}]`)
    b.evidence.push(
      ...r.attachments
        .filter((a) => a.name.startsWith('finding-') || a.name.endsWith('-top.png'))
        .map((a) => rel(a.path))
        .slice(0, 2),
    )
    bugs.set(key, b)
  }
}

const bugList = [...bugs.values()].sort(
  (a, b) => rank[a.severity] - rank[b.severity] || a.key.localeCompare(b.key),
)
const bySeverity = (s: Priority) => bugList.filter((b) => b.severity === s)
const confirmed = bugList.filter((b) => b.source === 'failed test' || b.note?.verdict === 'bug')

const L: string[] = []
const started = new Date(report.stats.startTime)
L.push('# DALGA DESIGN website — QA report', '')
L.push(
  `Generated ${new Date().toISOString()} from the run started ${started.toISOString()} (${Math.round(report.stats.duration / 1000)}s).`,
  '',
)
L.push('## Executive summary', '')
L.push(
  `${rows.length} test executions across 5 viewports: **${counts.passed} passed, ${counts.failed} failed, ${counts.flaky} flaky, ${counts.skipped} skipped**. ` +
    `Of ${INVENTORY.length} inventory items, ${checked} were actually checked (${coverage}%); ${itemCounts.failed} failed, ${itemCounts.flaky} flaky, ${itemCounts.unverified} could not be verified, ${itemCounts.skipped} skipped, ${itemCounts['not covered']} not covered. ` +
    (checked === INVENTORY.length
      ? 'Every inventory item was exercised.'
      : 'Coverage is **not** 100%: see the unverified and not-covered items below.'),
  '',
)
L.push(
  `Issues: **${bugList.length}** (${(['Critical', 'High', 'Medium', 'Low'] as Priority[]).map((s) => `${bySeverity(s).length} ${s}`).join(', ')}), of which ${confirmed.length} come from failing assertions or were confirmed in triage.`,
  '',
)
if (existsSync(resolve(ROOT, 'triage/summary.md')))
  L.push(readFileSync(resolve(ROOT, 'triage/summary.md'), 'utf8').trim(), '')

L.push(
  '## Counts',
  '',
  '| | Passed | Failed | Flaky | Skipped | Unverified | Not covered |',
  '|---|---|---|---|---|---|---|',
)
L.push(
  `| Test executions | ${counts.passed} | ${counts.failed} | ${counts.flaky} | ${counts.skipped} | – | – |`,
)
L.push(
  `| Inventory items | ${itemCounts.passed} | ${itemCounts.failed} | ${itemCounts.flaky} | ${itemCounts.skipped} | ${itemCounts.unverified} | ${itemCounts['not covered']} |`,
  '',
)

L.push('## Bugs by severity', '')
for (const sev of ['Critical', 'High', 'Medium', 'Low'] as Priority[]) {
  const list = bySeverity(sev)
  L.push(`### ${sev} (${list.length})`, '')
  if (!list.length) L.push('None.', '')
  for (const b of list) {
    const n = b.note
    L.push(`#### ${b.key} — ${b.title}`, '')
    L.push(
      `- **Source:** ${b.source}${n?.verdict ? ` · triage verdict: ${n.verdict}` : ' · not yet triaged'}`,
    )
    L.push(`- **Page:** ${[...b.pages].join(', ')}`)
    L.push(`- **Viewport:** ${[...b.viewports].join(', ')}`)
    if (n?.steps?.length)
      L.push('- **Steps to reproduce:**', ...n.steps.map((s, i) => `  ${i + 1}. ${s}`))
    else
      L.push(
        `- **Steps to reproduce:** run \`npx playwright test ${b.tests[0]?.split(' — ')[0] ?? ''}\``,
      )
    L.push(`- **Expected:** ${n?.expected ?? 'See the assertion message below.'}`)
    L.push(
      `- **Actual:** ${n?.actual ?? (b.detail || b.error.split('\n').slice(0, 6).join(' ').slice(0, 600))}`,
    )
    if (b.error)
      L.push('- **Assertion:**', '', '```', b.error.split('\n').slice(0, 14).join('\n'), '```', '')
    if (b.detail && n?.actual)
      L.push('- **Detector output:**', '', '```', b.detail.slice(0, 1500), '```', '')
    L.push(
      `- **Evidence:** ${
        [...new Set(b.evidence)]
          .slice(0, 5)
          .map((e) => `[${e.split('/').pop()}](${e})`)
          .join(', ') || 'see HTML report'
      }`,
    )
    if (b.runtime.length)
      L.push(
        `- **Console/network:** ${[...new Set(b.runtime)]
          .slice(0, 5)
          .map((x) => `\`${x.slice(0, 160)}\``)
          .join('; ')}`,
      )
    L.push(`- **Suspected root cause:** ${n?.rootCause ?? 'Needs triage.'}`)
    L.push(`- **Suggested fix:** ${n?.fix ?? 'Needs triage.'}`)
    L.push(`- **Regression test:** ${n?.regression ?? b.tests[0] ?? ''}`)
    L.push(`- **Tests:** ${[...new Set(b.tests)].slice(0, 4).join('; ')}`, '')
  }
}

const flakyRows = rows.filter((r) => r.status === 'flaky')
L.push('## Flaky tests', '')
if (!flakyRows.length) L.push('None.', '')
for (const r of flakyRows) {
  const n = notes[r.inventory[0] ?? '']
  L.push(
    `- ${r.title} [${r.project}] (${r.file}:${r.line}): failed once, passed on retry.${n?.verdict === 'flaky' && n.actual ? ` ${n.actual}` : ''}`,
  )
}
L.push('')

L.push('## Could not be verified', '')
const unv = [...unverifiedIds.entries()]
if (!unv.length) L.push('Nothing.', '')
for (const [id, reasons] of unv)
  L.push(`- **${id}**: ${[...new Set(reasons)].slice(0, 3).join(' ')}`)
L.push('')

L.push(
  '## Test inventory and coverage',
  '',
  '| ID | Item | Page | Area | Priority | Status | Viewports |',
  '|---|---|---|---|---|---|---|',
)
for (const item of [...INVENTORY].sort((a, b) => a.id.localeCompare(b.id))) {
  const s = itemStatus.get(item.id)!
  const icon = {
    passed: '✅ passed',
    failed: '❌ failed',
    flaky: '⚠️ flaky',
    skipped: '⏭ skipped',
    unverified: '❔ unverified',
    'not covered': '— not covered',
  }[s.status]
  L.push(
    `| ${item.id} | ${md(item.title)} | ${item.page} | ${item.area} | ${item.priority} | ${icon} | ${[...s.projects].join(', ')} |`,
  )
}
L.push('')

L.push('## Environment and method', '')
L.push(
  "- Target: the site's Vite dev server on localhost. The catalogue API was **mocked** with Playwright request interception (fixtures/mock-api.ts), serving the pieces from src/data/products.js (the seed file), so nothing was read from or written to Postgres. Admin login always fails in the mock, and every write is refused and recorded.",
)
L.push(
  '- The "Get your piece" form was tested against an intercepted api.emailjs.com: the request and the rendered email were checked, but no email was sent. The mailto: fallback (used only when EmailJS keys are missing) was not exercised.',
)
L.push(
  "- External hosts (Google Fonts, Instagram, Facebook) were stubbed, so screenshots use fallback fonts for the Google faces. The site's own fonts, images and Instagram feed (public/) were served normally.",
)
L.push(
  '- Flakiness: every failing test was retried once automatically; tests that passed on retry are reported as flaky, not as bugs.',
)
L.push(
  '- Evidence: failure screenshots, traces and axe/layout JSON under `qa-output/test-results/`; full-page, dark-theme and RTL screenshots per viewport under `qa-output/screenshots/` (when present); everything, including top/middle/bottom shots, in the Playwright HTML report (`npm run qa:html`).',
  '',
)

mkdirSync(OUT, { recursive: true })
const target = resolve(OUT, 'qa-report.md')
writeFileSync(target, L.join('\n'))
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ghost QA report</title><style>body{font:15px/1.55 system-ui,sans-serif;max-width:1100px;margin:2rem auto;padding:0 1rem;color:#1d1a1b}table{border-collapse:collapse;font-size:13px;width:100%}th,td{border:1px solid #ddd;padding:4px 8px;text-align:left;vertical-align:top}pre{background:#f6f3f2;padding:10px;overflow:auto;font-size:12px}h4{margin-top:2rem;border-top:1px solid #eee;padding-top:1rem}code{background:#f6f3f2;padding:1px 4px}</style></head><body>${await marked.parse(L.join('\n'))}</body></html>`
writeFileSync(resolve(OUT, 'qa-report.html'), html)
console.log(
  `QA report written to ${relative(process.cwd(), target)}: ${counts.passed} passed, ${counts.failed} failed, ${counts.flaky} flaky, ${counts.skipped} skipped; ${bugList.length} issues.`,
)
