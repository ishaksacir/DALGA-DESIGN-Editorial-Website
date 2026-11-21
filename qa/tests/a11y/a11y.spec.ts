import { test, expect } from '../../fixtures/test'
import { ROUTES } from '../../inventory/inventory'
import { open, scrollThrough } from '../../helpers/page'
import { runAxe, blocking } from '../../helpers/a11y'

for (const route of ROUTES) {
  test(`axe ${route.id}`, async ({ page, api, runtime, cover }, testInfo) => {
    cover(`A11Y-${route.id}`)
    runtime.allow(/.*/)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await open(page, route.path)
    await scrollThrough(page)
    const { violations } = await runAxe(page, testInfo, route.id)
    const serious = blocking(violations).map(
      (v) =>
        `[${v.impact}] ${v.id}: ${v.help} (${v.nodes} nodes) e.g. ${v.targets.slice(0, 3).join(' | ')}`,
    )
    expect(serious, 'no critical/serious WCAG violations').toEqual([])
  })
}

test('axe: contact drawer open @any', async ({ page, api, runtime, cover }, testInfo) => {
  cover('A11Y-DIALOG')
  runtime.allow(/.*/)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await open(page, '/catalogue/ink-wrap-top')
  const isPhone = (page.viewportSize()?.width ?? 1440) <= 480
  const problems: string[] = []

  if (isPhone) {
    const sheet = page
      .locator('.ph-sheet[role=dialog], [role=dialog].ph-sheet, .ph-sheet [role=dialog]')
      .first()
    await expect(
      page
        .locator('[role=dialog][aria-modal=true]')
        .filter({ has: page.locator('.ph-sheet-inner') }),
    ).toBeVisible()
    const s = await runAxe(page, testInfo, 'piece-sheet', '.ph-sheet-inner')
    problems.push(
      ...blocking(s.violations).map(
        (v) => `piece sheet: ${v.id} – ${v.help} (${v.targets.join(' | ')})`,
      ),
    )
    void sheet
    let escaped = ''
    for (let i = 0; i < 25 && !escaped; i++) {
      await page.keyboard.press('Tab')
      escaped = await page.evaluate(() => {
        const a = document.activeElement as HTMLElement | null
        return a && a !== document.body && !a.closest('.ph-sheet, [role=dialog]')
          ? `${a.tagName.toLowerCase()} "${(a.innerText || a.getAttribute('aria-label') || '').trim().slice(0, 30)}"`
          : ''
      })
    }
    if (escaped)
      problems.push(
        `piece sheet: Tab moves focus out of the open sheet to the page behind (${escaped})`,
      )
    await page.locator('.ph-sheet-foot .ph-button').click()
  } else {
    await page.getByRole('button', { name: /ask about this piece/i }).click()
  }
  const drawer = page.locator('aside.contact-drawer')
  await expect(drawer).toHaveClass(/open/)
  const d = await runAxe(page, testInfo, 'contact-drawer', 'aside.contact-drawer')
  problems.push(
    ...blocking(d.violations).map((v) => `drawer: ${v.id} – ${v.help} (${v.targets.join(' | ')})`),
  )
  const closeName = await drawer
    .locator('.contact-drawer-close')
    .evaluate((el) => (el.getAttribute('aria-label') ?? (el as HTMLElement).innerText).trim())
  if (!closeName) problems.push('drawer close button has no accessible name')
  const focusInside = await page.evaluate(
    () => !!document.activeElement?.closest('aside.contact-drawer'),
  )
  if (!focusInside) problems.push('focus is not moved into the drawer')
  expect(problems).toEqual([])
})

test('reduced motion: content visible and news does not auto-rotate', async ({
  page,
  api,
  runtime,
  cover,
}) => {
  cover('A11Y-RM', 'HOME-003')
  runtime.allow(/.*/)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await open(page, '/')
  const news = page.locator('.atelier-news')
  await news.scrollIntoViewIfNeeded()
  const current = () =>
    page.locator(".atelier-news [aria-current='true']").getAttribute('aria-label')
  const before = await current()
  await page.waitForTimeout(9_000)
  expect
    .soft(await current(), 'featured news post does not rotate on its own with reduced motion')
    .toBe(before)

  for (const path of ['/', '/one-of-one', '/about', '/catalogue']) {
    await open(page, path)
    await scrollThrough(page)
    const hidden = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLElement>('main h1, main h2, main h3'))
        .filter(
          (h) =>
            h.getBoundingClientRect().height > 0 &&
            Number(getComputedStyle(h).opacity) < 0.1 &&
            !h.closest("[aria-hidden='true'], [inert]"),
        )
        .map((h) => h.innerText.slice(0, 40)),
    )
    expect.soft(hidden, `${path}: headings visible with reduced motion`).toEqual([])
  }
})

test('keyboard: tab order through the nav and drawer with visible focus', async ({
  page,
  api,
  runtime,
  cover,
}) => {
  cover('KBD-001')
  runtime.allow(/.*/)
  await open(page, '/')
  const seen: { label: string; outline: boolean }[] = []
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press('Tab')
    seen.push(
      await page.evaluate(() => {
        const el = document.activeElement as HTMLElement
        const look = (n: Element | null) => {
          if (!n) return ''
          const s = getComputedStyle(n)
          return [
            s.outlineStyle,
            s.outlineWidth,
            s.outlineColor,
            s.boxShadow,
            s.borderColor,
            s.backgroundColor,
            s.textDecorationLine,
          ].join('|')
        }
        const focused = [look(el), look(el.parentElement)]
        el.blur()
        const blurred = [look(el), look(el.parentElement)]
        el.focus()
        return {
          label: (el.innerText || el.getAttribute('aria-label') || el.tagName).trim().slice(0, 30),
          outline: focused[0] !== blurred[0] || focused[1] !== blurred[1],
        }
      }),
    )
  }
  const labels = seen.map((s) => s.label.toLowerCase()).join(' | ')
  expect(labels).toContain('catalogue')
  expect
    .soft(
      seen.filter((s) => !s.outline).map((s) => s.label),
      'every focused control shows a visible focus indicator',
    )
    .toEqual([])

  await page.locator('nav.nav .nav-cta').focus()
  await page.keyboard.press('Enter')
  const drawer = page.locator('aside.contact-drawer')
  await expect(drawer).toHaveClass(/open/)
  for (let i = 0; i < 60; i++) {
    await page.keyboard.press('Tab')
    const inside = await page.evaluate(
      () => !!document.activeElement?.closest('aside.contact-drawer'),
    )
    expect(inside, `focus stays inside the drawer (tab ${i + 1})`).toBe(true)
  }
  await page.keyboard.press('Escape')
  await expect(drawer).not.toHaveClass(/open/)
  expect(
    await page.evaluate(() => document.activeElement?.classList.contains('nav-cta')),
    'focus returns to the trigger',
  ).toBe(true)
})
