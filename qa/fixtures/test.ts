import { writeFileSync } from 'node:fs'
import { test as base, expect, type Page, type TestInfo } from '@playwright/test'
import { MockApi, BASE_URL } from './mock-api'

export interface RuntimeEvent {
  kind: 'console-error' | 'page-error' | 'request-failed' | 'http-error'
  text: string
  url?: string
}

export class RuntimeMonitor {
  events: RuntimeEvent[] = []
  allowed: RegExp[] = []

  constructor(page: Page) {
    page.on('console', (msg) => {
      if (msg.type() === 'error')
        this.events.push({ kind: 'console-error', text: msg.text(), url: msg.location().url })
    })
    page.on('pageerror', (err) =>
      this.events.push({ kind: 'page-error', text: `${err.name}: ${err.message}` }),
    )
    page.on('requestfailed', (req) => {
      const failure = req.failure()?.errorText ?? ''
      if (failure.includes('ERR_BLOCKED_BY_CLIENT') || failure.includes('ERR_ABORTED')) return
      this.events.push({
        kind: 'request-failed',
        text: `${req.method()} ${failure}`,
        url: req.url(),
      })
    })
    page.on('response', (res) => {
      const url = res.url()
      if (!url.startsWith(BASE_URL)) return
      if (res.status() >= 400)
        this.events.push({
          kind: 'http-error',
          text: `${res.status()} ${res.request().method()}`,
          url,
        })
    })
  }

  allow(...patterns: RegExp[]) {
    this.allowed.push(...patterns)
  }

  problems() {
    return this.events.filter(
      (e) => !this.allowed.some((re) => re.test(`${e.text} ${e.url ?? ''}`)),
    )
  }
}

export interface Finding {
  id: string
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
  title: string
  detail: string
  page?: string
  viewport?: string
}

type Fixtures = {
  api: MockApi
  runtime: RuntimeMonitor
  cover: (...ids: string[]) => void
  finding: (f: Finding, evidence?: Page) => Promise<void>
  unverified: (id: string, reason: string) => void
  shot: (name: string, body: Buffer) => Promise<void>
}

export const test = base.extend<Fixtures>({
  api: async ({ context }, use) => {
    const api = new MockApi()
    await api.install(context)
    await use(api)
  },
  runtime: async ({ page }, use, testInfo) => {
    const monitor = new RuntimeMonitor(page)
    await use(monitor)
    if (monitor.events.length) {
      await testInfo.attach('runtime-events.json', {
        body: JSON.stringify(monitor.events, null, 2),
        contentType: 'application/json',
      })
    }
  },
  cover: async ({}, use, testInfo) => {
    await use((...ids: string[]) => {
      for (const id of ids) testInfo.annotations.push({ type: 'inventory', description: id })
    })
  },
  finding: async ({}, use, testInfo) => {
    await use(async (f: Finding, evidence?: Page) => {
      const viewport = f.viewport ?? testInfo.project.name
      testInfo.annotations.push({
        type: 'finding',
        description: JSON.stringify({ ...f, viewport }),
      })
      if (evidence) {
        const path = testInfo.outputPath(`finding-${f.id}.png`)
        const ok = await evidence.screenshot({ path }).then(
          () => true,
          () => false,
        )
        if (ok) await testInfo.attach(`finding-${f.id}.png`, { path, contentType: 'image/png' })
      }
    })
  },
  shot: async ({}, use, testInfo) => {
    await use(async (name: string, body: Buffer) => {
      const path = testInfo.outputPath(name)
      writeFileSync(path, body)
      await testInfo.attach(name, {
        path,
        contentType: name.endsWith('.json') ? 'application/json' : 'image/png',
      })
    })
  },
  unverified: async ({}, use, testInfo) => {
    await use((id: string, reason: string) => {
      testInfo.annotations.push({ type: 'unverified', description: JSON.stringify({ id, reason }) })
    })
  },
})

export { expect }

export function isMobile(testInfo: TestInfo) {
  return (testInfo.project.use.viewport?.width ?? 1440) < 768
}
