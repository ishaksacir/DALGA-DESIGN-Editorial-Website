import type { Page } from '@playwright/test'

export interface LayoutReport {
  viewport: { width: number; height: number }
  scrollWidth: number
  clientWidth: number
  horizontalScroll: boolean
  overflowing: { selector: string; left: number; right: number; width: number }[]
  occluded: { selector: string; coveredBy: string; text: string }[]
  clippedText: { selector: string; text: string; scrollWidth: number; clientWidth: number }[]
  smallTargets: { selector: string; text: string; width: number; height: number }[]
  brokenImages: { selector: string; src: string }[]
}

export async function inspectLayout(
  page: Page,
  opts: { checkTargets?: boolean } = {},
): Promise<LayoutReport> {
  return page.evaluate(
    ({ checkTargets }) => {
      const vw = document.documentElement.clientWidth
      const vh = window.innerHeight

      const sel = (el: Element): string => {
        const parts: string[] = []
        let node: Element | null = el
        for (let depth = 0; node && depth < 4 && node !== document.body; depth++) {
          let part = node.tagName.toLowerCase()
          if (node.id) {
            part += `#${node.id}`
            parts.unshift(part)
            break
          }
          const cls = Array.from(node.classList)
            .filter((c) => !/^(active|open|in-view|is-open)$/.test(c))
            .slice(0, 2)
          if (cls.length) part += `.${cls.join('.')}`
          parts.unshift(part)
          node = node.parentElement
        }
        return parts.join(' > ')
      }

      const visible = (el: Element) => {
        const s = getComputedStyle(el)
        if (s.display === 'none' || s.visibility === 'hidden' || Number(s.opacity) === 0)
          return false
        if (el.closest("[aria-hidden='true'], [inert]")) return false
        const r = el.getBoundingClientRect()
        return r.width > 0 && r.height > 0
      }

      const clippedByAncestor = (el: Element) => {
        const r = el.getBoundingClientRect()
        let p = el.parentElement
        while (p && p !== document.documentElement) {
          const s = getComputedStyle(p)
          if (/(hidden|clip|auto|scroll)/.test(s.overflowX) || s.contain.includes('paint')) {
            const pr = p.getBoundingClientRect()
            if (pr.right <= vw + 1 && pr.left >= -1) return true
            if (r.right <= pr.right + 1 && r.left >= pr.left - 1) return true
          }
          if (s.position === 'fixed') return false
          p = p.parentElement
        }
        return false
      }

      const overflowing: LayoutReport['overflowing'] = []
      for (const el of Array.from(document.body.querySelectorAll('*'))) {
        if (overflowing.length >= 12) break
        if (!visible(el)) continue
        const r = el.getBoundingClientRect()
        if ((r.right > vw + 1 || r.left < -1) && !clippedByAncestor(el)) {
          const parent = el.parentElement
          if (parent && overflowing.some((o) => o.selector === sel(parent))) continue
          overflowing.push({
            selector: sel(el),
            left: Math.round(r.left),
            right: Math.round(r.right),
            width: Math.round(r.width),
          })
        }
      }

      const header = document.querySelector('nav.nav, .ph-header, .scroll-nav.shown')
      const headerBottom = header ? header.getBoundingClientRect().bottom : 0
      const interactive = Array.from(
        document.querySelectorAll<HTMLElement>(
          "a[href], button, input, select, textarea, [role='button']",
        ),
      ).filter((el) => visible(el) && el.tabIndex >= 0 && !(el as HTMLButtonElement).disabled)

      const occluded: LayoutReport['occluded'] = []
      for (const el of interactive) {
        if (occluded.length >= 12) break
        const r = el.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        if (cx < 0 || cx > vw || cy < headerBottom + 4 || cy > vh - 100) continue
        if (header && header.contains(el)) continue
        const hit = document.elementFromPoint(cx, cy)
        if (!hit || hit === el || el.contains(hit) || hit.contains(el)) continue
        if (hit.closest('label') && hit.closest('label')?.contains(el)) continue
        if (el.closest('label')?.contains(hit)) continue
        occluded.push({
          selector: sel(el),
          coveredBy: sel(hit),
          text: (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 40),
        })
      }

      const clippedText: LayoutReport['clippedText'] = []
      for (const el of Array.from(
        document.body.querySelectorAll<HTMLElement>('h1, h2, h3, h4, p, span, a, button, label'),
      )) {
        if (clippedText.length >= 12) break
        if (
          !visible(el) ||
          !el.innerText?.trim() ||
          el.clientWidth <= 2 ||
          el.classList.contains('sr-only')
        )
          continue
        const s = getComputedStyle(el)
        if (!/(hidden|clip)/.test(s.overflowX) || s.textOverflow === 'ellipsis') continue
        if (el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0) {
          clippedText.push({
            selector: sel(el),
            text: el.innerText.trim().slice(0, 60),
            scrollWidth: el.scrollWidth,
            clientWidth: el.clientWidth,
          })
        }
      }

      const smallTargets: LayoutReport['smallTargets'] = []
      if (checkTargets) {
        for (const el of interactive) {
          if (smallTargets.length >= 15) break
          if (
            el.closest('p, li') &&
            el.tagName === 'A' &&
            getComputedStyle(el).display === 'inline'
          )
            continue
          const r = el.getBoundingClientRect()
          const host =
            el.closest('label') ??
            (/(INPUT|SELECT|TEXTAREA)/.test(el.tagName) ? el.parentElement : null)
          if (host) {
            const hr = host.getBoundingClientRect()
            if (hr.width >= 24 && hr.height >= 24) continue
          }
          const cx = r.left + r.width / 2
          const cy = r.top + r.height / 2
          const spaced = interactive.every((o) => {
            if (o === el || o.contains(el) || el.contains(o)) return true
            const or = o.getBoundingClientRect()
            const dx = Math.max(or.left - cx, 0, cx - or.right)
            const dy = Math.max(or.top - cy, 0, cy - or.bottom)
            return Math.hypot(dx, dy) >= 12
          })
          if (spaced) continue
          if (r.width < 24 || r.height < 24) {
            smallTargets.push({
              selector: sel(el),
              text: (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 40),
              width: Math.round(r.width),
              height: Math.round(r.height),
            })
          }
        }
      }

      const brokenImages = Array.from(document.images)
        .filter(
          (img) =>
            img.getAttribute('src') &&
            img.complete &&
            img.naturalWidth === 0 &&
            img.loading !== 'lazy',
        )
        .map((img) => ({ selector: sel(img), src: img.currentSrc || img.src }))

      return {
        viewport: { width: vw, height: vh },
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: vw,
        horizontalScroll: document.documentElement.scrollWidth > vw + 1,
        overflowing,
        occluded,
        clippedText,
        smallTargets,
        brokenImages,
      }
    },
    { checkTargets: !!opts.checkTargets },
  )
}

export async function brokenImagesAfterScroll(page: Page) {
  return page.evaluate(() =>
    Array.from(document.images)
      .filter((img) => img.getAttribute('src') && img.complete && img.naturalWidth === 0)
      .map((img) => img.currentSrc || img.src),
  )
}
