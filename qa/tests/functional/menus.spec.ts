import { test, expect } from '../../fixtures/test'
import { open, waitForPath, scrollLocked } from '../../helpers/page'
import { runAxe, blocking } from '../../helpers/a11y'

test.describe('Compact menu (≤800px) @compact', () => {
  test('opens, traps focus, Escape, navigates, restores scroll and focus @compact', async ({
    page,
    api,
    runtime,
    cover,
  }, testInfo) => {
    cover('NAV-005')
    runtime.allow(/.*/)
    await open(page, '/about')
    await expect(page.locator('nav.nav .nav-links-desktop')).toBeHidden()
    const toggle = page.locator('nav.nav .nav-toggle')
    const panel = page.locator('#mobile-nav-panel')
    await toggle.click()
    await expect(panel).toHaveClass(/open/)
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(await scrollLocked(page)).toBe(true)
    // Let the 0.32s fade-in finish; mid-fade the ink ground is half transparent and every colour fails.
    await expect(panel).toHaveCSS('opacity', '1')
    const { violations } = await runAxe(page, testInfo, 'compact-menu', '#mobile-nav-panel')
    expect.soft(blocking(violations).map((v) => v.id)).toEqual([])
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab')
      expect(
        await page.evaluate(() => !!document.activeElement?.closest('#mobile-nav-panel')),
      ).toBe(true)
    }
    await page.keyboard.press('Escape')
    await expect(panel).not.toHaveClass(/open/)
    expect(await scrollLocked(page)).toBe(false)
    expect(
      await page.evaluate(() => document.activeElement?.classList.contains('nav-toggle')),
    ).toBe(true)

    await toggle.click()
    await panel.getByRole('link', { name: /Catalogue/ }).click()
    await waitForPath(page, /^\/catalogue$/)
    await expect(panel).not.toHaveClass(/open/)
    expect(await scrollLocked(page)).toBe(false)

    await page.locator('nav.nav .nav-toggle').click()
    await panel.locator('.nav-mobile-cta').click()
    await expect(panel).not.toHaveClass(/open/)
    await expect(page.locator('aside.contact-drawer')).toHaveClass(/open/)
    expect(await scrollLocked(page), 'page stays locked while the drawer is open').toBe(true)
    await page.keyboard.press('Escape')
    expect(await scrollLocked(page)).toBe(false)
  })
})

test.describe('Phone menu (≤480px) @phone', () => {
  test('opens, navigates, Inquire opens the drawer, closes @phone', async ({
    page,
    api,
    runtime,
    cover,
  }) => {
    cover('NAV-006', 'FTR-001')
    runtime.allow(/.*/)
    await open(page, '/')
    const burger = page.locator(".ph-nav button[aria-controls='ph-menu']")
    const menu = page.locator('#ph-menu')
    await burger.tap()
    await expect(menu).toHaveClass(/open/)
    await expect(burger).toHaveAttribute('aria-expanded', 'true')
    await expect(burger).toHaveAttribute('aria-label', 'Close menu')
    expect(await scrollLocked(page)).toBe(true)
    await menu.getByRole('link', { name: 'Catalogue' }).tap()
    await waitForPath(page, /^\/catalogue$/)
    await expect(menu).not.toHaveClass(/open/)
    expect(await scrollLocked(page)).toBe(false)

    await burger.tap()
    await menu.getByRole('button', { name: 'Inquire' }).tap()
    await expect(page.locator('aside.contact-drawer')).toHaveClass(/open/)
    await page.locator('.contact-drawer-close').tap()
    expect(await scrollLocked(page)).toBe(false)

    await burger.tap()
    await burger.tap()
    await expect(menu).not.toHaveClass(/open/)
    const footer = page.locator('footer').last()
    await expect(footer.locator("a[href^='mailto:']")).toHaveAttribute(
      'href',
      'mailto:studio.dalgadesign@gmail.com',
    )
    await footer.getByRole('link', { name: 'About' }).tap()
    await waitForPath(page, /^\/about$/)
  })

  test('phone contact: failure screen and retry @phone', async ({ page, api, runtime, cover }) => {
    cover('CON-006')
    runtime.allow(/.*/)
    api.set({ fail: { emailjs: { status: 500 } } })
    await open(page, '/')
    await page.locator(".ph-nav button[aria-controls='ph-menu']").tap()
    await page.locator('#ph-menu').getByRole('button', { name: 'Inquire' }).tap()
    const drawer = page.locator('aside.contact-drawer')
    await drawer.getByLabel('Name', { exact: true }).fill('Test')
    await drawer.getByLabel('Surname', { exact: true }).fill('Visitor')
    await drawer.getByLabel('Phone number').fill('061000000')
    await drawer.getByLabel('Message').fill('QA phone test')
    await drawer.locator('button[type=submit]').tap()
    const failed = drawer.locator('.contact-failed')
    await expect(failed).toBeVisible()
    await expect(failed.locator("a[href^='mailto:']")).toHaveAttribute(
      'href',
      /studio\.dalgadesign@gmail\.com/,
    )
    api.set({ fail: { emailjs: undefined } })
    await failed.getByRole('button', { name: /try again/i }).tap()
    await expect(drawer.locator('.contact-sent')).toBeVisible()
    expect(api.emails).toHaveLength(2)
  })
})
