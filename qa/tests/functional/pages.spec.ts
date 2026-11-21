import { test, expect } from '../../fixtures/test'
import { open, scrollThrough } from '../../helpers/page'

test.describe('One of one, About, Admin, copy', () => {
  test('FAQ: one answer open at a time; closed answers unreachable', async ({
    page,
    api,
    runtime,
    cover,
  }) => {
    cover('OOO-001')
    runtime.allow(/.*/)
    await open(page, '/one-of-one')
    const items = page.locator('.faq-item')
    const n = await items.count()
    expect(n).toBeGreaterThan(1)
    const q = (i: number) => items.nth(i).locator('h3 button')
    await q(0).scrollIntoViewIfNeeded()
    await q(0).click()
    await expect(q(0)).toHaveAttribute('aria-expanded', 'true')
    await expect(items.nth(0).locator('.faq-panel')).not.toHaveAttribute('inert', '')
    await q(1).click()
    await expect(q(1)).toHaveAttribute('aria-expanded', 'true')
    await expect(q(0)).toHaveAttribute('aria-expanded', 'false')
    await expect(items.nth(0).locator('.faq-panel')).toHaveAttribute('inert', '')
    await q(1).click()
    await expect(page.locator('.faq-item h3 button[aria-expanded=true]')).toHaveCount(0)
  })

  test('About page renders its sections and links', async ({ page, api, runtime, cover }) => {
    cover('ABT-001')
    runtime.allow(/.*/)
    await open(page, '/about')
    await scrollThrough(page)
    await expect(page.locator('main h1')).toHaveCount(1)
    expect(await page.locator('main h2').count()).toBeGreaterThan(0)
    const imgs = await page
      .locator('main img')
      .evaluateAll((els) =>
        els.map((e) => [(e as HTMLImageElement).alt, (e as HTMLImageElement).naturalWidth]),
      )
    expect(imgs.filter(([, w]) => w === 0)).toEqual([])
  })

  test('Admin login: no access without login; wrong password and lockout errors', async ({
    page,
    api,
    runtime,
    cover,
  }) => {
    cover('ADM-001')
    runtime.allow(/.*/)
    await open(page, '/admin')
    await expect(page.getByRole('heading', { name: 'Atelier admin' })).toBeVisible()
    const pw = page.getByLabel('Password')
    const btn = page.getByRole('button', { name: 'Log in' })
    await expect(btn).toBeDisabled()
    await pw.fill('not-the-password')
    await btn.click()
    await expect(page.getByText('Wrong password.')).toBeVisible()
    await expect(page.locator('.admin-login')).toBeVisible()
    api.set({
      fail: {
        login: { status: 429, body: { error: 'Too many attempts. Try again in 15 minutes.' } },
      },
    })
    await btn.click()
    await expect(page.getByText(/Too many attempts/)).toBeVisible()
    api.set({ fail: { login: 'abort' } })
    await btn.click()
    await expect(page.getByText(/Cannot reach the server/)).toBeVisible()
    expect(api.callsTo('write'), 'no catalogue write was attempted').toHaveLength(0)
    expect(await page.evaluate(() => document.cookie)).not.toContain('dalga_admin')
  })

  test('copy: related messages agree', async ({ page, api, runtime, cover, finding }) => {
    cover('I18N-002')
    runtime.allow(/.*/)
    const checks: string[] = []
    for (const lang of ['en', 'bs'] as const) {
      await open(page, '/catalogue/darigo-dress', { lang })
      const note = (await page.locator('.product-cta-note').innerText()).trim()
      await page.locator('.product-cta button').click()
      const intro = (await page.locator('.contact-intro p').innerText()).trim()
      await page.keyboard.press('Escape')
      checks.push(`${lang}: product page "${note}" vs drawer "${intro}"`)
    }
    const contradicts = checks.some(
      (c) => /week|sedmic/i.test(c) && /two working days|dva radna dana/i.test(c),
    )
    if (contradicts) {
      await finding({
        id: 'COPY-REPLY-TIME',
        severity: 'Low',
        title: 'Reply time promised differently on the product page and in the drawer',
        detail: checks.join('\n'),
        page: '/catalogue/:id',
      })
    }
    expect.soft(contradicts, 'reply-time promise is consistent').toBe(false)
  })
})
