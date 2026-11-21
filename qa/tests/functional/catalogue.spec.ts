import { test, expect } from '../../fixtures/test'
import { open, pathAndQuery, waitForPath } from '../../helpers/page'
import { products } from '../../fixtures/mock-api'

const cards = '.catalogue-grid .card'
const filters = '.catalogue-filters button'
const total = products.length
const countOf = (cat: string) => products.filter((p) => p.category.en === cat).length

test.describe('Catalogue (desktop)', () => {
  test('12 pieces first, Show more adds the rest; counts match', async ({
    page,
    api,
    runtime,
    cover,
  }) => {
    cover('CAT-001')
    runtime.allow(/.*/)
    await open(page, '/catalogue')
    await expect(page.locator(cards)).toHaveCount(Math.min(12, total))
    await expect(page.locator(filters).first()).toContainText(String(total))
    const more = page.locator('.catalogue-more-btn')
    await expect(more).toHaveText(`Show ${Math.min(12, total - 12)} more`)
    await more.click()
    await expect(page.locator(cards)).toHaveCount(Math.min(24, total))
    await waitForPath(page, /^\/catalogue\?show=24$/)
    if (total > 24) {
      await page.locator('.catalogue-more-btn').click()
      await expect(page.locator(cards)).toHaveCount(total)
    }
    await expect(page.locator('.catalogue-more-btn')).toHaveCount(0)
    const numbers = await page.locator(`${cards} .card-number`).allInnerTexts()
    expect(numbers).toEqual(products.map((p) => p.number))
    const labels = await page
      .locator(filters)
      .evaluateAll((bs) =>
        bs.map((b) => [
          b.querySelector('span')?.textContent,
          Number(b.querySelector('b')?.textContent),
        ]),
      )
    const sum = labels.slice(1).reduce((a, [, n]) => a + (n as number), 0)
    expect(sum, 'category counts add up to All pieces').toBe(total)
  })

  test('filters narrow the grid; URL keeps the filter; survives language switch', async ({
    page,
    api,
    runtime,
    cover,
  }) => {
    cover('CAT-002')
    runtime.allow(/.*/)
    await open(page, '/catalogue')
    await page.locator(filters, { hasText: /^Coat/i }).click()
    await waitForPath(page, /^\/catalogue\?category=Coat$/)
    await expect(page.locator(cards)).toHaveCount(countOf('Coat'))
    await expect(page.locator(filters, { hasText: /^Coat/i })).toHaveClass(/active/)
    await page.locator('nav.nav .lang-switch').getByRole('button', { name: 'bs' }).click()
    await expect(page.locator(cards)).toHaveCount(countOf('Coat'))
    await expect(page.locator(filters + '.active')).toContainText(/Kaput/i)
    await page.locator(filters).first().click()
    await waitForPath(page, /^\/catalogue$/)
    await expect(page.locator(cards)).toHaveCount(Math.min(12, total))
  })

  test('bad URL params are handled', async ({ page, api, runtime, cover }) => {
    cover('CAT-003')
    runtime.allow(/.*/)
    await open(page, '/catalogue?show=abc')
    await expect(page.locator(cards)).toHaveCount(12)
    await open(page, '/catalogue?show=-5')
    await expect.soft(page.locator(cards), '?show=-5 still shows the first page').toHaveCount(12)
    await open(page, '/catalogue?category=Nonexistent')
    const shown = await page.locator(cards).count()
    const active = await page.locator(filters + '.active').count()
    expect(
      shown > 0 || active > 0,
      "an unknown category doesn't leave a blank grid with no active filter",
    ).toBe(true)
  })

  test('card → product → Back restores filter, count and scroll', async ({
    page,
    api,
    runtime,
    cover,
  }) => {
    cover('CAT-004')
    runtime.allow(/.*/)
    await open(page, '/catalogue')
    await page.locator('.catalogue-more-btn').click()
    await waitForPath(page, /show=24/)
    const card = page.locator(cards).nth(17)
    await card.scrollIntoViewIfNeeded()
    const y = await page.evaluate(() => window.scrollY)
    await card.locator('a').click()
    await waitForPath(page, new RegExp(`^/catalogue/${products[17].id}$`))
    await page.locator('a.text-link', { hasText: 'Catalogue' }).click()
    await waitForPath(page, /^\/catalogue\?show=24$/)
    await expect(page.locator(cards)).toHaveCount(24)
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(y - 120)
  })

  test('back link from a direct product visit opens the catalogue at that piece', async ({
    page,
    api,
    runtime,
    cover,
  }) => {
    cover('CAT-005')
    runtime.allow(/.*/)
    const target = products[20]
    await open(page, `/catalogue/${target.id}`)
    await page.locator('a.text-link', { hasText: 'Catalogue' }).click()
    await waitForPath(page, /^\/catalogue\?show=24$/)
    const card = page.locator(`[data-product="${target.id}"]`)
    await expect(card).toBeVisible()
    await expect(card).toBeInViewport()
  })
})

test.describe('Catalogue (phone) @phone', () => {
  test('type chips filter; every piece is reachable under a type @phone', async ({
    page,
    api,
    runtime,
    cover,
    finding,
  }) => {
    cover('CAT-006')
    runtime.allow(/.*/)
    await open(page, '/catalogue')
    const grid = page.locator('.ph-grid-card')
    await expect(grid).toHaveCount(total)
    const chips = page.locator('.ph-chips button')
    const ids = new Set<string>()
    for (let i = 1; i < (await chips.count()); i++) {
      await chips.nth(i).click()
      await expect(chips.nth(i)).toHaveAttribute('aria-pressed', 'true')
      const n = Number(await chips.nth(i).locator('.ph-chip-count').innerText())
      await expect(grid).toHaveCount(n)
      for (const href of await grid.evaluateAll((as) =>
        as.map((a) => a.getAttribute('href') ?? ''),
      ))
        ids.add(new URLSearchParams(href.split('?')[1]).get('piece') ?? '')
    }
    expect(await pathAndQuery(page)).toMatch(/\?type=/)
    const orphans = products.filter((p) => !ids.has(p.id))
    if (orphans.length) {
      await finding({
        id: 'CAT-PHONE-ORPHAN',
        severity: 'Medium',
        title: 'On phones, some pieces appear under no type filter',
        detail: `${orphans.map((p) => `#${p.number} ${p.name.en} (${p.category.en})`).join(', ')} only show under "All": their category is missing from TYPES_BY_CATEGORY in CataloguePhone.jsx.`,
        page: '/catalogue',
      })
    }
    expect(
      orphans.map((p) => `${p.number} ${p.category.en}`),
      'every piece shows under at least one type',
    ).toEqual([])
  })
})
