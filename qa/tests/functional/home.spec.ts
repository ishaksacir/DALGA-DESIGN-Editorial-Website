import { test, expect } from '../../fixtures/test'
import { open, waitForPath } from '../../helpers/page'
import { products } from '../../fixtures/mock-api'

test.describe('Home', () => {
  test('showcase arrows rotate the tiles and wrap; tiles link to products', async ({
    page,
    api,
    runtime,
    cover,
  }) => {
    cover('HOME-001')
    runtime.allow(/.*/)
    await open(page, '/')
    const items = page.locator('.gallery-track .gallery-item')
    await items.first().scrollIntoViewIfNeeded()
    await expect(items).toHaveCount(4)
    const first = () => items.first().getAttribute('href')
    expect(await first()).toBe(`/catalogue/${products[0].id}`)
    await page.locator('.gallery-arrow-next').click()
    expect(await first()).toBe(`/catalogue/${products[1].id}`)
    await page.locator('.gallery-arrow-prev').click()
    await page.locator('.gallery-arrow-prev').click()
    expect(await first()).toBe(`/catalogue/${products.at(-1)!.id}`)
    expect(await items.nth(1).getAttribute('href')).toBe(`/catalogue/${products[0].id}`)
    await items.nth(2).click()
    await waitForPath(page, new RegExp(`^/catalogue/${products[1].id}$`))
    await expect(page.locator('.product-info h1')).toHaveText(products[1].name.en)
  })

  test('news pager switches the featured post; links open Instagram in a new tab', async ({
    page,
    api,
    runtime,
    cover,
  }) => {
    cover('HOME-002')
    runtime.allow(/.*/)
    await open(page, '/')
    const news = page.locator('.atelier-news')
    await news.scrollIntoViewIfNeeded()
    const pager = news.locator('.news-pager button')
    const n = await pager.count()
    expect(n).toBeGreaterThan(1)
    const title = () =>
      news.locator('.news-featured-text h3, .news-featured-text h2').first().innerText()
    const before = await title()
    await pager.nth(n - 1).click()
    await expect(pager.nth(n - 1)).toHaveAttribute('aria-current', 'true')
    await expect.poll(title).not.toBe(before)
    for (const a of await news.locator('a[href]').all()) {
      await expect(a).toHaveAttribute('href', /instagram\.com/)
      await expect(a).toHaveAttribute('target', '_blank')
    }
  })

  test('news falls back to news.js when the Instagram feed is missing', async ({
    page,
    api,
    runtime,
    cover,
  }) => {
    cover('HOME-005')
    runtime.allow(/.*/)
    await page.route('**/instagram/feed.json', (r) => r.fulfill({ status: 404, body: '' }))
    await open(page, '/')
    const news = page.locator('.atelier-news')
    await news.scrollIntoViewIfNeeded()
    await expect(news.locator('.news-featured-text')).toBeVisible()
    await expect(news.locator('.news-featured-media img').first()).toHaveAttribute(
      'src',
      /\/images\/news\//,
    )
  })

  test('process filmstrip steps through the stages on scroll', async ({
    page,
    api,
    runtime,
    cover,
  }) => {
    cover('HOME-004')
    runtime.allow(/.*/)
    await open(page, '/')
    const section = page.locator('section.process')
    const filled = () => section.locator('.process-bars .filled').count()
    const box = await section.evaluate((el) => ({
      top: el.getBoundingClientRect().top + window.scrollY,
      height: (el as HTMLElement).offsetHeight,
    }))
    await page.evaluate((b) => window.scrollTo(0, b.top), box)
    await expect.poll(filled).toBe(1)
    await page.evaluate((b) => window.scrollTo(0, b.top + b.height - window.innerHeight - 5), box)
    await expect.poll(filled).toBe(4)
  })
})
