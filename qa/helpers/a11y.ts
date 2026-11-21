import { writeFileSync } from 'node:fs'
import AxeBuilder from '@axe-core/playwright'
import type { Page, TestInfo } from '@playwright/test'

export interface AxeSummary {
  id: string
  impact: string
  help: string
  helpUrl: string
  nodes: number
  targets: string[]
}

export async function runAxe(page: Page, testInfo: TestInfo, label: string, include?: string) {
  let builder = new AxeBuilder({ page }).withTags([
    'wcag2a',
    'wcag2aa',
    'wcag21a',
    'wcag21aa',
    'wcag22aa',
    'best-practice',
  ])
  if (include) builder = builder.include(include)
  const results = await builder.analyze()
  const violations: AxeSummary[] = results.violations.map((v) => ({
    id: v.id,
    impact: v.impact ?? 'minor',
    help: v.help,
    helpUrl: v.helpUrl,
    nodes: v.nodes.length,
    targets: v.nodes.slice(0, 6).map((n) => n.target.join(' ')),
  }))
  const path = testInfo.outputPath(`axe-${label}.json`)
  writeFileSync(path, JSON.stringify(violations, null, 2))
  await testInfo.attach(`axe-${label}.json`, { path, contentType: 'application/json' })
  return { violations, incomplete: results.incomplete.length, passes: results.passes.length }
}

export const blocking = (v: AxeSummary[]) =>
  v.filter((x) => x.impact === 'critical' || x.impact === 'serious')
