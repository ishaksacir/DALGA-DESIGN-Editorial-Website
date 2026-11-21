import { test, expect } from '../../fixtures/test'
import { ROUTES } from '../../inventory/inventory'
import { open, scrollThrough } from '../../helpers/page'

interface Candidate {
  index: number
  label: string
  selector: string
  semantic: boolean
}

const MAX_PER_ROUTE = 45

for (const route of ROUTES) {
  test(`every visible control on ${route.id} does something`, async ({
    page,
    api,
    runtime,
    cover,
    finding,
  }, testInfo) => {
    cover('KBD-002')
    runtime.allow(/.*/)
    test.setTimeout(180_000)
    await open(page, route.path)
    await scrollThrough(page)

    const candidates: Candidate[] = await page.evaluate((max) => {
      const sel = (el: Element) => {
        const cls = Array.from(el.classList)
          .filter((c) => !/^(active|open)$/.test(c))
          .slice(0, 2)
          .join('.')
        return `${el.tagName.toLowerCase()}${cls ? '.' + cls : ''}`
      }
      const all = Array.from(document.querySelectorAll<HTMLElement>('body *'))
      const out: { el: HTMLElement; semantic: boolean }[] = []
      for (const el of all) {
        const s = getComputedStyle(el)
        const r = el.getBoundingClientRect()
        if (
          r.width < 4 ||
          r.height < 4 ||
          s.visibility === 'hidden' ||
          s.display === 'none' ||
          el.closest("[aria-hidden='true'], [inert]")
        )
          continue
        if (
          el.closest(
            'nav.nav, .scroll-nav, footer, #mobile-nav-panel, .ph-nav, aside.contact-drawer, .contact-scrim, .ph-sheet-scrim',
          )
        )
          continue
        const isButton =
          el.tagName === 'BUTTON' &&
          !(el as HTMLButtonElement).disabled &&
          (el as HTMLButtonElement).type !== 'submit'
        const pointerNonSemantic =
          s.cursor === 'pointer' &&
          !el.closest('a, button, label, input, select, textarea, summary, [role]') &&
          getComputedStyle(el.parentElement!).cursor !== 'pointer'
        if (isButton || pointerNonSemantic) out.push({ el, semantic: isButton })
      }
      return out.slice(0, max).map(({ el, semantic }, index) => {
        el.setAttribute('data-qa-candidate', String(index))
        return {
          index,
          semantic,
          selector: sel(el),
          label: (el.innerText || el.getAttribute('aria-label') || el.getAttribute('title') || '')
            .trim()
            .replace(/\s+/g, ' ')
            .slice(0, 40),
        }
      })
    }, MAX_PER_ROUTE)

    const dead: Candidate[] = []
    const mouseOnly: Candidate[] = []
    for (const c of candidates) {
      if (
        page.url().replace(/[?#].*$/, '') !==
          new URL(route.path, page.url()).href.replace(/[?#].*$/, '') ||
        !(await page.locator(`[data-qa-candidate="${c.index}"]`).count())
      ) {
        await open(page, route.path)
        await scrollThrough(page)
        await page.evaluate((max) => {
          const all = Array.from(document.querySelectorAll<HTMLElement>('body *'))
          let i = 0
          for (const el of all) {
            const s = getComputedStyle(el)
            const r = el.getBoundingClientRect()
            if (
              r.width < 4 ||
              r.height < 4 ||
              s.visibility === 'hidden' ||
              s.display === 'none' ||
              el.closest("[aria-hidden='true'], [inert]")
            )
              continue
            if (
              el.closest(
                'nav.nav, .scroll-nav, footer, #mobile-nav-panel, .ph-nav, aside.contact-drawer, .contact-scrim, .ph-sheet-scrim',
              )
            )
              continue
            const isButton =
              el.tagName === 'BUTTON' &&
              !(el as HTMLButtonElement).disabled &&
              (el as HTMLButtonElement).type !== 'submit'
            const pointerNonSemantic =
              s.cursor === 'pointer' &&
              !el.closest('a, button, label, input, select, textarea, summary, [role]') &&
              getComputedStyle(el.parentElement!).cursor !== 'pointer'
            if ((isButton || pointerNonSemantic) && i < max)
              el.setAttribute('data-qa-candidate', String(i++))
          }
        }, MAX_PER_ROUTE)
      }
      const target = page.locator(`[data-qa-candidate="${c.index}"]`)
      if (!(await target.count())) continue
      const alreadyOn = await target.evaluate(
        (el) =>
          el.getAttribute('aria-current') === 'true' ||
          el.getAttribute('aria-pressed') === 'true' ||
          el.classList.contains('active') ||
          el.classList.contains('is-active'),
      )
      if (alreadyOn) continue
      const before = page.url()
      await page.evaluate(() => {
        ;(window as unknown as { __qaMut: number }).__qaMut = 0
        const obs = new MutationObserver(
          (m) => ((window as unknown as { __qaMut: number }).__qaMut += m.length),
        )
        obs.observe(document.documentElement, {
          subtree: true,
          childList: true,
          attributes: true,
          characterData: true,
          attributeFilter: [
            'class',
            'style',
            'data-theme',
            'dir',
            'aria-expanded',
            'aria-pressed',
            'aria-label',
            'data-offset',
            'disabled',
            'value',
          ],
        })
        ;(window as unknown as { __qaObs: MutationObserver }).__qaObs = obs
      })
      const clicked = await target.scrollIntoViewIfNeeded({ timeout: 2000 }).then(
        () =>
          target.click({ timeout: 2500, trial: false }).then(
            () => true,
            () => false,
          ),
        () => false,
      )
      await page.waitForTimeout(350)
      const mutations = await page
        .evaluate(() => (window as unknown as { __qaMut?: number }).__qaMut ?? -1)
        .catch(() => -1)
      const changed = page.url() !== before || mutations !== 0 || page.isClosed()
      if (clicked && !changed) dead.push(c)
      if (clicked && changed && !c.semantic) mouseOnly.push(c)
      if (page.url() !== before) continue
      await page.keyboard.press('Escape').catch(() => {})
    }

    await testInfo.attach(`controls-${route.id}.json`, {
      body: JSON.stringify({ candidates, dead, mouseOnly }, null, 2),
      contentType: 'application/json',
    })
    if (mouseOnly.length) {
      const unique = [...new Map(mouseOnly.map((m) => [m.selector, m])).values()]
      await finding({
        id: `MOUSE-ONLY-${route.id}`,
        severity: 'High',
        title: `Mouse-only clickable elements on ${route.path}`,
        detail:
          unique.map((m) => `${m.selector} "${m.label}"`).join('\n') +
          '\nThese respond to clicks but are not buttons/links, so they cannot be reached or activated with the keyboard.',
        page: route.path,
      })
    }
    const deadList = dead.map((d) => `${d.selector} "${d.label}"`)
    expect.soft(deadList, 'no element that looks clickable does nothing').toEqual([])
  })
}
