import { test, expect } from '../../fixtures/test'
import { ROUTES } from '../../inventory/inventory'
import { open, pathAndQuery, waitForPath, scrollLocked } from '../../helpers/page'

const nav = (page: import('@playwright/test').Page) => page.locator('nav.nav')

test.describe('Desktop navigation', () => {
  test('logo returns home; nav links route and mark active', async ({
    page,
    api,
    runtime,
    cover,
  }) => {
    cover('NAV-001', 'NAV-002')
    runtime.allow(/.*/)
    await open(page, '/about')
    for (const [label, path] of [
      ['Catalogue', '/catalogue'],
      ['One of one', '/one-of-one'],
      ['About', '/about'],
    ] as const) {
      await nav(page).getByRole('link', { name: label, exact: true }).click()
      await waitForPath(page, new RegExp(`^${path}$`))
      await expect(nav(page).getByRole('link', { name: label, exact: true })).toHaveClass(/active/)
      await expect(page.locator('main')).toBeVisible()
    }
    await nav(page).locator('a.brand').click()
    await waitForPath(page, /^\/$/)
  })

  test('language switch: copy, html lang, title, persistence; Bosnian is the default', async ({
    page,
    api,
    runtime,
    cover,
  }) => {
    cover('NAV-003', 'I18N-001')
    runtime.allow(/.*/)
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'bs')
    await expect(nav(page)).toContainText(/Katalog/i)
    const sw = nav(page).locator('.lang-switch')
    await sw.getByRole('button', { name: 'en' }).click()
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(sw.getByRole('button', { name: 'en' })).toHaveAttribute('aria-pressed', 'true')
    await expect(nav(page)).toContainText(/Catalogue/i)
    await expect(page).toHaveTitle(/Clothing from Bihać/)
    expect(await page.locator('meta[name="description"]').getAttribute('content')).toMatch(
      /^DALGA DESIGN — clothing/,
    )
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await sw.getByRole('button', { name: 'bs' }).click()
    await expect(page).toHaveTitle(/Odjeća iz Bihaća/)
  })

  test('scroll bar slides in when scrolling up and hides when scrolling down', async ({
    page,
    api,
    runtime,
    cover,
  }) => {
    cover('NAV-004')
    runtime.allow(/.*/)
    await open(page, '/catalogue')
    const bar = page.locator('nav.scroll-nav')
    await expect(bar).not.toHaveClass(/shown/)
    await page.mouse.wheel(0, 2500)
    await page.waitForTimeout(400)
    await expect(bar).not.toHaveClass(/shown/)
    await page.mouse.wheel(0, -300)
    await expect(bar).toHaveClass(/shown/)
    await bar.getByRole('button', { name: /get your piece/i }).click()
    await expect(page.locator('aside.contact-drawer')).toHaveClass(/open/)
    await expect(bar, 'bar hides while the drawer is open').not.toHaveClass(/shown/)
    await page.keyboard.press('Escape')
    await page.mouse.wheel(0, 600)
    await expect(bar).not.toHaveClass(/shown/)
  })

  test('direct load, reload and back/forward on every route', async ({
    page,
    api,
    runtime,
    cover,
  }) => {
    cover('NAV-007')
    runtime.allow(/.*/)
    const visited: string[] = []
    for (const r of ROUTES) {
      await open(page, r.path)
      expect(await pathAndQuery(page), `${r.path} loads without redirect`).toBe(r.path)
      await expect(page.locator('#root')).not.toBeEmpty()
      visited.push(r.path)
    }
    await page.reload()
    expect(await pathAndQuery(page)).toBe(visited.at(-1))
    for (let i = visited.length - 2; i >= visited.length - 4; i--) {
      await page.goBack()
      expect(await pathAndQuery(page)).toBe(visited[i])
    }
    await page.goForward()
    expect(await pathAndQuery(page)).toBe(visited[visited.length - 3])
  })

  test('unknown routes show the 404 page with a way home', async ({
    page,
    api,
    runtime,
    cover,
  }) => {
    cover('NAV-008')
    runtime.allow(/.*/)
    await open(page, '/nope/deeper?x=1')
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()
    await page.getByRole('link', { name: /Return home/ }).click()
    await waitForPath(page, /^\/$/)
  })

  test('new pages open at the top; Back restores scroll', async ({ page, api, runtime, cover }) => {
    cover('NAV-009')
    runtime.allow(/.*/)
    await open(page, '/one-of-one')
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
    await page.waitForTimeout(300)
    const deep = await page.evaluate(() => window.scrollY)
    await page.locator('footer').getByRole('link', { name: 'About', exact: true }).click()
    await waitForPath(page, /^\/about$/)
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(5)
    await page.goBack()
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(deep - 50)
  })
})

test.describe('Footer', () => {
  test('links route; email and social targets are correct', async ({
    page,
    api,
    runtime,
    cover,
  }) => {
    cover('FTR-001', 'FTR-002')
    runtime.allow(/.*/)
    await open(page, '/')
    const footer = page.locator('footer').first()
    await expect(footer.locator("a[href^='mailto:']")).toHaveAttribute(
      'href',
      'mailto:studio.dalgadesign@gmail.com',
    )
    for (const [label, host] of [
      ['Instagram', 'instagram.com/dalga.design'],
      ['Facebook', 'facebook.com/dalgadesign'],
    ]) {
      const a = footer.getByRole('link', { name: label })
      await expect(a).toHaveAttribute('href', new RegExp(host.replace(/\./g, '\\.')))
      await expect(a).toHaveAttribute('target', '_blank')
      expect(await a.getAttribute('rel')).toMatch(/noreferrer|noopener/)
    }
    await footer.getByRole('link', { name: 'Catalogue', exact: true }).click()
    await waitForPath(page, /^\/catalogue$/)
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
    await page.locator('footer .footer-top').click()
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(5)
    expect(await scrollLocked(page)).toBe(false)
  })
})
