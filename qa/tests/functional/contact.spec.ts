import type { Page } from '@playwright/test'
import { test, expect } from '../../fixtures/test'
import { open, scrollLocked, waitForPath } from '../../helpers/page'

const drawer = (page: Page) => page.locator('aside.contact-drawer')
const form = (page: Page) => drawer(page).locator('form.contact-form')
const submit = (page: Page) => drawer(page).locator('button.contact-primary[type=submit]')
const error = (page: Page) => drawer(page).locator('.contact-error')

async function openFromNav(page: Page) {
  await open(page, '/')
  await page.locator('nav.nav .nav-cta').click()
  await expect(drawer(page)).toHaveClass(/open/)
}

async function fill(
  page: Page,
  v: Partial<Record<'name' | 'surname' | 'phone' | 'message', string>>,
) {
  const f = form(page)
  if (v.name !== undefined) await f.getByLabel('Name', { exact: true }).fill(v.name)
  if (v.surname !== undefined) await f.getByLabel('Surname', { exact: true }).fill(v.surname)
  if (v.phone !== undefined) await f.getByLabel('Phone number').fill(v.phone)
  if (v.message !== undefined) await f.getByLabel('Message').fill(v.message)
}

const VALID = {
  name: 'Test',
  surname: 'Visitor',
  phone: '+387 61 000 000',
  message: 'QA test request — please ignore.',
}

test.describe('Get your piece drawer', () => {
  test('opens from every trigger', async ({ page, api, runtime, cover }) => {
    cover('CON-001')
    runtime.allow(/.*/)
    const triggers: [string, (p: Page) => Promise<void>][] = [
      ['/', (p) => p.locator('nav.nav .nav-cta').click()],
      [
        '/',
        async (p) => {
          await p.locator('.home-cta-bar').scrollIntoViewIfNeeded()
          await p.locator('.home-cta-bar').click()
        },
      ],
      [
        '/catalogue/darigo-dress',
        (p) => p.getByRole('button', { name: /ask about this piece/i }).click(),
      ],
      [
        '/one-of-one',
        async (p) => {
          await p.locator('.faq-more button').scrollIntoViewIfNeeded()
          await p.locator('.faq-more button').click()
        },
      ],
      [
        '/about',
        async (p) => {
          const b = p
            .locator('main')
            .getByRole('button', { name: /write to the atelier/i })
            .first()
          await b.scrollIntoViewIfNeeded()
          await b.click()
        },
      ],
    ]
    for (const [path, trigger] of triggers) {
      await open(page, path)
      await trigger(page)
      await expect(drawer(page), `drawer opens on ${path}`).toHaveClass(/open/)
      await expect(
        drawer(page).getByRole('heading', { name: 'Write to the atelier.' }),
      ).toBeVisible()
      await page.keyboard.press('Escape')
      await expect(drawer(page)).not.toHaveClass(/open/)
    }
  })

  test('Escape, Close and scrim close it; scroll lock and focus are restored', async ({
    page,
    api,
    runtime,
    cover,
  }) => {
    cover('CON-002')
    runtime.allow(/.*/)
    await openFromNav(page)
    expect(await scrollLocked(page)).toBe(true)
    expect(
      await page.evaluate(() => !!document.activeElement?.closest('aside.contact-drawer')),
    ).toBe(true)
    await drawer(page).locator('.contact-drawer-close').click()
    await expect(drawer(page)).not.toHaveClass(/open/)
    expect(await scrollLocked(page)).toBe(false)
    expect(await page.evaluate(() => document.activeElement?.classList.contains('nav-cta'))).toBe(
      true,
    )
    await page.locator('nav.nav .nav-cta').click()
    await page.locator('.contact-scrim').click({ position: { x: 20, y: 300 }, force: true })
    await expect(drawer(page)).not.toHaveClass(/open/)
    expect(await scrollLocked(page)).toBe(false)
  })

  test('validation: empty, whitespace, short phone, message-or-piece rule', async ({
    page,
    api,
    runtime,
    cover,
  }) => {
    cover('CON-003')
    runtime.allow(/.*/)
    await openFromNav(page)
    await submit(page).click()
    await expect(error(page)).toHaveText('Please fill in the highlighted fields.')
    await expect(form(page).locator('.contact-input.invalid')).toHaveCount(4)

    await fill(page, { name: '   ', surname: 'Visitor', phone: '+387 61 000 000', message: 'Hi' })
    await submit(page).click()
    await expect(error(page)).toHaveText('Please fill in the highlighted fields.')
    await expect(form(page).getByLabel('Name', { exact: true })).toHaveAttribute(
      'aria-invalid',
      'true',
    )

    await fill(page, { name: 'Test', phone: '12-34-56' })
    await submit(page).click()
    await expect(error(page)).toHaveText('Please check your phone number.')

    await fill(page, { phone: '061 000 000', message: '   ' })
    await submit(page).click()
    await expect(error(page)).toHaveText('Tag a piece or write a short message.')

    await drawer(page).locator('.contact-thumb').first().click()
    await expect(error(page)).toHaveText('')
    expect(api.emails).toHaveLength(0)
  })

  test('tag pieces, write notes, remove a tag', async ({ page, api, runtime, cover }) => {
    cover('CON-004')
    runtime.allow(/.*/)
    await openFromNav(page)
    const thumbs = drawer(page).locator('.contact-thumb')
    await expect(thumbs).toHaveCount((await import('../../fixtures/mock-api')).products.length)
    await thumbs.nth(4).click()
    await thumbs.nth(9).click()
    await expect(thumbs.nth(4)).toHaveAttribute('aria-pressed', 'true')
    const tagged = drawer(page).locator('.contact-tagged')
    await expect(tagged).toHaveCount(2)
    await tagged.first().locator('.contact-note').fill('in red linen')
    await tagged.nth(1).getByRole('button', { name: 'Remove' }).click()
    await expect(tagged).toHaveCount(1)
    await expect(thumbs.nth(9)).toHaveAttribute('aria-pressed', 'false')
    await expect(tagged.first().locator('.contact-note')).toHaveValue('in red linen')
  })

  test('valid request sends one mocked EmailJS call with the right content', async ({
    page,
    api,
    runtime,
    cover,
  }) => {
    cover('CON-005', 'CON-007')
    runtime.allow(/.*/)
    await openFromNav(page)
    await drawer(page).locator('.contact-thumb').nth(4).click()
    await drawer(page).locator('.contact-note').fill('but in navy')
    await fill(page, VALID)
    await submit(page).click()
    await expect(drawer(page).locator('.contact-sent')).toBeVisible()
    await expect(drawer(page).locator('.contact-sent')).toContainText('Test')
    expect(api.emails).toHaveLength(1)
    const p = api.emails[0].template_params
    expect(p.to_email).toBe('studio.dalgadesign@gmail.com')
    expect(p.name).toBe('Test Visitor')
    expect(p.subject).toContain('Test')
    for (const piece of ['05', 'Darigo', 'but in navy', '+387 61 000 000', 'QA test request'])
      expect(p.html, `email contains "${piece}"`).toContain(piece)
    expect(p.html, 'email images use absolute URLs').not.toMatch(/src="\/(images|uploads)\//)

    await drawer(page)
      .getByRole('button', { name: /send another/i })
      .click()
    await expect(form(page).getByLabel('Name', { exact: true })).toHaveValue('')
    await expect(drawer(page).locator('.contact-tagged')).toHaveCount(0)
    await page.keyboard.press('Escape')
    await page.locator('nav.nav .nav-cta').click()
    await fill(page, VALID)
    await submit(page).click()
    await drawer(page).locator('.contact-sent .contact-primary').click()
    await expect(drawer(page)).not.toHaveClass(/open/)
    await page.locator('nav.nav .nav-cta').click()
    await expect(
      form(page).getByLabel('Name', { exact: true }),
      'a sent request starts fresh',
    ).toHaveValue('')
  })

  test('send failure keeps the form and retry works', async ({ page, api, runtime, cover }) => {
    cover('CON-006')
    runtime.allow(/.*/)
    api.set({ fail: { emailjs: { status: 400, body: 'The Public Key is invalid' } } })
    await openFromNav(page)
    await fill(page, VALID)
    await submit(page).click()
    await expect(error(page)).toHaveText('Your message didn’t send. Please try again.')
    await expect(form(page).getByLabel('Message')).toHaveValue(VALID.message)
    api.set({ fail: { emailjs: 'abort' } })
    await submit(page).click()
    await expect(error(page)).toHaveText(/didn’t send/)
    api.set({ fail: { emailjs: undefined } })
    await submit(page).click()
    await expect(drawer(page).locator('.contact-sent')).toBeVisible()
    expect(api.emails).toHaveLength(3)
  })

  test('unsent input is kept after closing and reopening', async ({
    page,
    api,
    runtime,
    cover,
  }) => {
    cover('CON-008')
    runtime.allow(/.*/)
    await openFromNav(page)
    await fill(page, { name: 'Keep', message: 'kept text' })
    await page.keyboard.press('Escape')
    await page.locator('nav.nav .nav-cta').click()
    await expect(form(page).getByLabel('Name', { exact: true })).toHaveValue('Keep')
    await expect(form(page).getByLabel('Message')).toHaveValue('kept text')
  })

  test('double submit sends only once', async ({ page, api, runtime, cover }) => {
    cover('CON-009')
    runtime.allow(/.*/)
    api.set({ delayMs: { emailjs: 1500 } })
    await openFromNav(page)
    await fill(page, VALID)
    await submit(page).click()
    await expect(submit(page)).toBeDisabled()
    await expect(submit(page)).toHaveText(/Sending/)
    await form(page).getByLabel('Message').press('Enter')
    await form(page).getByLabel('Name', { exact: true }).press('Enter')
    await expect(drawer(page).locator('.contact-sent')).toBeVisible({ timeout: 5000 })
    expect(api.emails).toHaveLength(1)
  })

  test('Ask about this piece pre-tags that piece', async ({ page, api, runtime, cover }) => {
    cover('CON-010')
    runtime.allow(/.*/)
    await open(page, '/catalogue/darigo-dress')
    await page.getByRole('button', { name: /ask about this piece/i }).click()
    const tagged = drawer(page).locator('.contact-tagged')
    await expect(tagged).toHaveCount(1)
    await expect(tagged).toContainText('Darigo')
    await page.keyboard.press('Escape')
    await page.locator('nav.nav').getByRole('link', { name: 'Catalogue', exact: true }).click()
    await waitForPath(page, /^\/catalogue$/)
    await page.locator('.catalogue-grid .card a').nth(1).click()
    await page.getByRole('button', { name: /ask about this piece/i }).click()
    await expect(tagged, 'both pieces stay tagged; the first is not lost').toHaveCount(2)
  })
})
