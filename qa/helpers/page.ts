import { expect, type Page, type Locator, type TestInfo } from '@playwright/test'

export interface OpenOptions {
  lang?: 'bs' | 'en'
}

/** Phone layout (≤480px) renders dedicated phone components; 481–800px uses the compact nav. */
export const layoutOf = (testInfo: TestInfo): 'phone' | 'compact' | 'desktop' => {
  const w = testInfo.project.use.viewport?.width ?? 1440
  return w <= 480 ? 'phone' : w <= 800 ? 'compact' : 'desktop'
}

export async function open(page: Page, path: string, opts: OpenOptions = {}) {
  const { lang = 'en' } = opts
  await page.addInitScript((l) => {
    try {
      if (!sessionStorage.getItem('qa-init')) {
        localStorage.setItem('dalga-language', l)
        sessionStorage.setItem('qa-init', '1')
      }
    } catch {}
  }, lang)
  await page.goto(path, { waitUntil: 'domcontentloaded' })
  await settle(page)
}

export async function settle(page: Page) {
  await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
  await page.locator('#root > *').first().waitFor({ state: 'attached', timeout: 15_000 })
  await page.evaluate(() => document.fonts?.ready).catch(() => {})
}

export async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const step = Math.max(200, Math.floor(window.innerHeight * 0.7))
    const max = () => document.documentElement.scrollHeight - window.innerHeight
    for (let y = 0; y <= max(); y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 120))
    }
    window.scrollTo(0, max())
    await new Promise((r) => setTimeout(r, 300))
  })
}

export async function scrollToFraction(page: Page, f: number) {
  await page.evaluate((frac) => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo(0, Math.round(max * frac))
  }, f)
  await page.waitForTimeout(500)
}

export async function scrollLocked(page: Page) {
  return page.evaluate(
    () =>
      document.body.style.overflow === 'hidden' ||
      document.documentElement.classList.contains('ph-locked'),
  )
}

export async function pathAndQuery(page: Page) {
  const u = new URL(page.url())
  return `${u.pathname}${u.search}`
}

export async function waitForPath(page: Page, re: RegExp) {
  await expect.poll(() => pathAndQuery(page), { timeout: 10_000 }).toMatch(re)
}

export async function isKeyboardReachable(page: Page, target: Locator, maxTabs = 80) {
  const handle = await target.elementHandle()
  if (!handle) return false
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur())
  for (let i = 0; i < maxTabs; i++) {
    await page.keyboard.press('Tab')
    const hit = await page.evaluate(
      (el) => !!el && (el === document.activeElement || el.contains(document.activeElement)),
      handle,
    )
    if (hit) return true
  }
  return false
}
