import { test, expect } from '../../fixtures/test'
import { open, waitForPath, pathAndQuery, scrollLocked } from '../../helpers/page'
import { products } from '../../fixtures/mock-api'

const multi = products.find((p) => (p.images?.length ?? 1) >= 4)!

test.describe('Product page', () => {
  test('shows name, specs, composition and care in the active language', async ({
    page,
    api,
    runtime,
    cover,
  }) => {
    cover('PRD-001')
    runtime.allow(/.*/)
    const p = products.find((x) => x.care?.length) ?? products[0]
    await open(page, `/catalogue/${p.id}`)
    const info = page.locator('.product-info')
    await expect(info.locator('h1')).toHaveText(p.name.en)
    await expect(info.locator('.category')).toHaveText(p.category.en)
    await expect(info.locator('.product-specs dt').first()).toHaveText(p.specs[0][0].en)
    await expect(info.locator('.product-specs')).toContainText('Single sample')
    if (p.care) await expect(info.locator('.product-care li')).toHaveCount(p.care.length)
    await page.locator('nav.nav .lang-switch').getByRole('button', { name: 'bs' }).click()
    await expect(info.locator('h1')).toHaveText(p.name.bs)
    await expect(info.locator('.product-specs dt').first()).toHaveText(p.specs[0][0].bs)
  })

  test('gallery thumbnails switch the image', async ({ page, api, runtime, cover }) => {
    cover('PRD-002')
    runtime.allow(/.*/)
    await open(page, `/catalogue/${multi.id}`)
    const main = page.locator('.product-gallery > figure img')
    const thumbs = page.locator('.product-thumbs button')
    await expect(thumbs).toHaveCount(multi.images!.length)
    await thumbs.nth(2).click()
    await expect(main).toHaveAttribute('src', multi.images![2])
    await expect(thumbs.nth(2)).toHaveAttribute('aria-current', 'true')
    await thumbs.nth(0).click()
    await expect(main).toHaveAttribute('src', multi.images![0])
  })

  test('unknown product shows not-found with a link back', async ({
    page,
    api,
    runtime,
    cover,
  }) => {
    cover('PRD-003')
    runtime.allow(/.*/)
    await open(page, '/catalogue/no-such-piece')
    await expect(page.getByRole('heading', { name: 'Piece not found' })).toBeVisible()
    await page.getByRole('link', { name: /Return to the catalogue/ }).click()
    await waitForPath(page, /^\/catalogue$/)
  })
})

test.describe('Phone piece sheet @phone', () => {
  test('opens from the grid; prev/next wrap; closes by ✕, Escape, Back and pull-down @phone', async ({
    page,
    api,
    runtime,
    cover,
  }) => {
    cover('SHT-001')
    runtime.allow(/.*/)
    await open(page, '/catalogue')
    const sheet = page
      .locator('[role=dialog][aria-modal=true]')
      .filter({ has: page.locator('.ph-sheet-inner') })
    await page.locator('.ph-grid-card').first().click()
    await waitForPath(page, new RegExp(`^/catalogue\\?piece=${products[0].id}$`))
    await expect(sheet).toHaveAttribute('aria-label', products[0].name.en)
    expect(await scrollLocked(page)).toBe(true)
    await sheet.getByRole('button', { name: 'Previous piece' }).click()
    await waitForPath(page, new RegExp(`piece=${products.at(-1)!.id}$`))
    await sheet.getByRole('button', { name: 'Next piece' }).click()
    await waitForPath(page, new RegExp(`piece=${products[0].id}$`))
    await sheet.locator('.ph-sheet-next').click()
    await waitForPath(page, new RegExp(`piece=${products[1].id}$`))
    await sheet.getByRole('button', { name: 'Close' }).click()
    await waitForPath(page, /^\/catalogue$/)
    expect(await scrollLocked(page)).toBe(false)

    const opened = async () => {
      await page.locator('.ph-grid-card').nth(3).click()
      await waitForPath(page, new RegExp(`piece=${products[3].id}$`))
      await expect(sheet).toHaveAttribute('aria-label', products[3].name.en)
      await page.waitForTimeout(300)
    }
    await opened()
    await page.keyboard.press('Escape')
    await waitForPath(page, /^\/catalogue$/)
    await opened()
    await page.goBack()
    await waitForPath(page, /^\/catalogue$/)
    await opened()
    const inner = page.locator('.ph-sheet-inner')
    const t = (y: number) => [{ identifier: 1, clientX: 195, clientY: y }]
    await inner.dispatchEvent('touchstart', { touches: t(120), changedTouches: t(120) })
    for (const y of [140, 200, 260, 320])
      await inner.dispatchEvent('touchmove', { touches: t(y), changedTouches: t(y) })
    await inner.dispatchEvent('touchend', { touches: [], changedTouches: t(320) })
    await waitForPath(page, /^\/catalogue$/)
    expect(await scrollLocked(page)).toBe(false)
  })

  test('/catalogue/:id redirects to the sheet; ?piece= deep link opens it @phone', async ({
    page,
    api,
    runtime,
    cover,
  }) => {
    cover('SHT-002', 'PRD-002')
    runtime.allow(/.*/)
    await open(page, `/catalogue/${multi.id}`)
    await waitForPath(page, new RegExp(`^/catalogue\\?piece=${multi.id}$`))
    const sheet = page
      .locator('[role=dialog][aria-modal=true]')
      .filter({ has: page.locator('.ph-sheet-inner') })
    await expect(sheet).toHaveAttribute('aria-label', multi.name.en)
    await sheet.getByRole('button', { name: 'Close' }).click()
    await waitForPath(page, /^\/catalogue$/)
    await open(page, '/catalogue?piece=no-such-piece')
    await expect(page.locator('.ph-sheet-inner h1, .ph-sheet-inner h2').first()).toBeHidden()
    expect(await scrollLocked(page)).toBe(false)
  })

  test('Start from this piece opens the drawer with it tagged @phone', async ({
    page,
    api,
    runtime,
    cover,
  }) => {
    cover('SHT-003')
    runtime.allow(/.*/)
    await open(page, `/catalogue?piece=${products[4].id}`)
    await page.locator('.ph-sheet-foot .ph-button').click()
    const drawer = page.locator('aside.contact-drawer')
    await expect(drawer).toHaveClass(/open/)
    await expect(drawer.locator('.contact-tagged')).toContainText(products[4].name.en)
    await page.keyboard.press('Escape')
    await expect(drawer).not.toHaveClass(/open/)
    await expect
      .poll(() => scrollLocked(page), {
        message: 'page scroll unlocked after the sheet hands over to the drawer and it closes',
      })
      .toBe(false)
    expect(await pathAndQuery(page)).toBe('/catalogue')
  })
})
