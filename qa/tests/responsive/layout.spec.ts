import { test, expect, isMobile } from '../../fixtures/test'
import { ROUTES } from '../../inventory/inventory'
import { open, scrollThrough, scrollToFraction } from '../../helpers/page'
import { inspectLayout, type LayoutReport } from '../../helpers/layout'

const summarize = (r: LayoutReport) =>
  [
    r.horizontalScroll ? `horizontal scroll: scrollWidth ${r.scrollWidth} > ${r.clientWidth}` : '',
    ...r.overflowing.map(
      (o) => `overflows viewport: ${o.selector} (left ${o.left}, right ${o.right})`,
    ),
  ]
    .filter(Boolean)
    .join('\n')

for (const route of ROUTES) {
  test.describe(`${route.name} @responsive`, () => {
    test(`layout ${route.id} @responsive`, async ({
      page,
      api,
      runtime,
      cover,
      finding,
      shot,
    }, testInfo) => {
      cover(`RESP-${route.id}`)
      runtime.allow(/.*/)
      await open(page, route.path)
      await scrollThrough(page)

      const positions: [string, number][] = [
        ['top', 0],
        ['middle', 0.5],
        ['bottom', 1],
      ]
      const reports: Record<string, LayoutReport> = {}
      for (const [label, f] of positions) {
        await scrollToFraction(page, f)
        reports[label] = await inspectLayout(page, { checkTargets: isMobile(testInfo) })
        await shot(`${route.id}-${label}.png`, await page.screenshot({ animations: 'disabled' }))
      }
      await shot(`layout-${route.id}.json`, Buffer.from(JSON.stringify(reports, null, 2)))

      await page.emulateMedia({ reducedMotion: 'reduce' })
      await scrollToFraction(page, 0)
      await shot(
        `full-${route.id}.png`,
        await page.screenshot({ fullPage: true, animations: 'disabled' }),
      )

      const all = Object.values(reports)
      const occluded = [
        ...new Map(all.flatMap((r) => r.occluded).map((o) => [o.selector, o])).values(),
      ]
      const clipped = [
        ...new Map(all.flatMap((r) => r.clippedText).map((o) => [o.selector, o])).values(),
      ]
      const small = [
        ...new Map(all.flatMap((r) => r.smallTargets).map((o) => [o.selector, o])).values(),
      ]
      const broken = [...new Set(all.flatMap((r) => r.brokenImages.map((b) => b.src)))]

      if (occluded.length) {
        await finding({
          id: `OCCLUDED-${route.id}`,
          severity: 'Medium',
          title: `Interactive elements covered by other elements on ${route.name}`,
          detail: occluded
            .map((o) => `${o.selector} "${o.text}" covered by ${o.coveredBy}`)
            .join('\n'),
          page: route.path,
        })
      }
      if (clipped.length) {
        await finding({
          id: `CLIPPED-${route.id}`,
          severity: 'Low',
          title: `Text clipped without ellipsis on ${route.name}`,
          detail: clipped
            .map((c) => `${c.selector} "${c.text}" (${c.scrollWidth}px in ${c.clientWidth}px)`)
            .join('\n'),
          page: route.path,
        })
      }
      if (small.length) {
        await finding({
          id: `TARGETS-${route.id}`,
          severity: 'Low',
          title: `Touch targets under 24×24px on ${route.name}`,
          detail: small.map((s) => `${s.selector} "${s.text}" ${s.width}×${s.height}`).join('\n'),
          page: route.path,
        })
      }
      expect.soft(broken, 'no broken images').toEqual([])
      const overflow = all.find((r) => r.horizontalScroll || r.overflowing.length)
      expect(overflow ? summarize(overflow) : '', 'no horizontal overflow').toBe('')
    })

    test(`bosnian ${route.id} @responsive`, async ({
      page,
      api,
      runtime,
      cover,
      shot,
    }, testInfo) => {
      const name = testInfo.project.name
      test.skip(
        name !== 'desktop-1440' && name !== 'mobile-375',
        'Bosnian (longer words) checked at desktop-1440 and mobile-375',
      )
      cover(`BS-${route.id}`)
      runtime.allow(/.*/)
      await open(page, route.path, { lang: 'bs' })
      if (route.id !== 'admin') await expect(page.locator('html')).toHaveAttribute('lang', 'bs')
      await scrollThrough(page)
      const reports: LayoutReport[] = []
      for (const f of [0, 0.5, 1]) {
        await scrollToFraction(page, f)
        reports.push(await inspectLayout(page))
      }
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await scrollToFraction(page, 0)
      await shot(
        `bs-${route.id}.png`,
        await page.screenshot({ fullPage: true, animations: 'disabled' }),
      )
      const clipped = [
        ...new Map(reports.flatMap((r) => r.clippedText).map((o) => [o.selector, o])).values(),
      ]
      expect
        .soft(
          clipped.map((c) => `${c.selector} "${c.text}"`),
          'Bosnian copy is not clipped',
        )
        .toEqual([])
      const overflow = reports.find((r) => r.horizontalScroll || r.overflowing.length)
      expect(overflow ? summarize(overflow) : '', 'no horizontal overflow in Bosnian').toBe('')
    })
  })
}
