import { test, expect } from '../../fixtures/test'
import { ROUTES } from '../../inventory/inventory'
import { open, scrollThrough } from '../../helpers/page'
import { brokenImagesAfterScroll } from '../../helpers/layout'

for (const route of ROUTES) {
  test(`runtime ${route.id}: no console errors, failed requests or broken images`, async ({
    page,
    api,
    runtime,
    cover,
  }) => {
    cover(`RT-${route.id}`)
    await open(page, route.path)
    await scrollThrough(page)
    await page.waitForTimeout(800)
    const broken = await brokenImagesAfterScroll(page)
    const unmocked = api.calls
      .filter((c) => c.endpoint === 'unmocked')
      .map((c) => `${c.method} ${c.url}`)
    const writes = api.calls
      .filter((c) => c.endpoint === 'write' || c.endpoint === 'emailjs')
      .map((c) => `${c.method} ${c.url}`)
    const problems = runtime.problems().map((e) => `${e.kind}: ${e.text} ${e.url ?? ''}`.trim())
    expect.soft(unmocked, 'every API call is a known endpoint').toEqual([])
    expect.soft(writes, 'just viewing a page sends nothing').toEqual([])
    expect.soft(broken, 'no broken images').toEqual([])
    expect(problems, 'no console errors, page errors or failed requests').toEqual([])
  })
}

test('runtime: every product photo in the catalogue loads', async ({
  page,
  api,
  runtime,
  cover,
}) => {
  cover('PRD-004')
  runtime.allow(/.*/)
  const { products } = await import('../../fixtures/mock-api')
  const urls = [...new Set(products.flatMap((p) => p.images ?? [p.img]))]
  await open(page, '/')
  const failed = await page.evaluate(async (list) => {
    const bad: string[] = []
    await Promise.all(
      list.map(async (u) => {
        const r = await fetch(u).catch(() => null)
        const type = r?.headers.get('content-type') ?? ''
        if (!r || !r.ok || !type.startsWith('image/'))
          bad.push(`${u} → ${r?.status ?? 'network'} ${type}`)
      }),
    )
    return bad
  }, urls)
  expect(failed, `${urls.length} product photos referenced by the catalogue`).toEqual([])
})

test('runtime: catalogue API down shows the load-error page and retry recovers', async ({
  page,
  api,
  runtime,
  cover,
}) => {
  cover('ERR-001')
  runtime.allow(/500/, /Failed to load resource/, /ERR_FAILED/, /net::/)
  for (const fail of [{ status: 500 }, 'abort' as const]) {
    api.set({ fail: { products: fail } })
    await open(page, '/catalogue')
    await expect(page.locator('.load-error')).toBeVisible()
    await expect(page.locator('.load-error h1')).toContainText(/archive/i)
    await expect(page.locator(".load-error a[href^='mailto:']")).toHaveAttribute(
      'href',
      'mailto:studio.dalgadesign@gmail.com',
    )
    const pageErrors = runtime.events.filter((e) => e.kind === 'page-error')
    expect(pageErrors).toEqual([])
  }
  api.set({ fail: { products: undefined } })
  await page
    .locator('.load-error')
    .getByRole('button', { name: /try again/i })
    .click()
  await expect(page.locator('.catalogue-grid .card, .ph-grid-card').first()).toBeVisible({
    timeout: 15_000,
  })
})

test('runtime: external hosts inventory', async ({ page, api, runtime, unverified }, testInfo) => {
  runtime.allow(/.*/)
  for (const route of ROUTES) {
    await open(page, route.path)
    await scrollThrough(page)
  }
  const hosts = [...new Set(api.externalBlocked.map((u) => new URL(u).host))]
  await testInfo.attach('external-requests.json', {
    body: JSON.stringify({ hosts, urls: [...new Set(api.externalBlocked)] }, null, 2),
    contentType: 'application/json',
  })
  unverified(
    'RT-external',
    `External assets were stubbed, not fetched (${hosts.join(', ') || 'none'}). Their availability was not verified.`,
  )
  expect(hosts.length).toBeGreaterThanOrEqual(0)
})
