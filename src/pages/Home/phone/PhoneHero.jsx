import { useEffect, useRef } from 'react'

import { asset } from '@/constants/site'
import { useI18n } from '@/i18n/context'
import { rafThrottle } from '@/utils/rafThrottle'

/** Width (px) of the figure window and outline before any scroll. */
const FIGURE = 150
/** Scroll distance (px) over which the window opens fully. */
const OPEN_OVER = 680
/** How far the figure grows at full scroll: scale = 1 + progress^CURVE * GROWTH. */
const GROWTH = 44
const CURVE = 2.4

const HERO = asset('home/hero-phone-sky.webp')

/**
 * Full-screen sticky hero. A blurred copy of the photo covers it, with the atelier's figure cut
 * out so the sharp photo shows through. Scrolling zooms the figure until the whole photo is sharp;
 * the white outline grows with it and fades, and the caption fades away.
 */
export function PhoneHero() {
  const { t } = useI18n()
  const blurRef = useRef(null)
  const outlineRef = useRef(null)
  const footRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const onScroll = rafThrottle(() => {
      const y = window.scrollY
      if (y > OPEN_OVER * 2.4) return
      const progress = Math.min(1, Math.max(0, y / OPEN_OVER))
      const scale = 1 + progress ** CURVE * GROWTH
      const size = `${(FIGURE * scale).toFixed(1)}px auto, 100% 100%`
      const blur = blurRef.current
      blur.style.webkitMaskSize = size
      blur.style.maskSize = size
      blur.style.opacity = String(progress > 0.8 ? Math.max(0, (1 - progress) / 0.2) : 1)
      outlineRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`
      outlineRef.current.style.opacity = String(Math.max(0, 1 - progress / 0.6))
      footRef.current.style.opacity = String(Math.max(0, 1 - y / 200))
    })
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      onScroll.cancel()
    }
  }, [])

  return (
    <header className="ph-hero">
      <div className="ph-hero-stage">
        <img className="ph-hero-bg" src={HERO} alt="" fetchPriority="high" />
        <div
          ref={blurRef}
          className="ph-hero-blur"
          aria-hidden="true"
          style={{ '--figure': `url(${asset('brand/zenka-fill.png')})` }}
        >
          <img src={HERO} alt="" />
        </div>
        <img
          ref={outlineRef}
          className="ph-hero-outline"
          src={asset('brand/zenka-outline.png')}
          alt=""
          aria-hidden="true"
        />
        <span className="ph-hero-shade" aria-hidden="true" />
        <h1 className="ph-visually-hidden">Dalga Design</h1>
        <div ref={footRef} className="ph-hero-foot">
          <div className="ph-hero-foot-in">
            <p>
              {t.phone.hero.name}
              <br />
              <span>{t.phone.hero.line}</span>
            </p>
            <span className="ph-hero-drip" aria-hidden="true" />
          </div>
        </div>
      </div>
    </header>
  )
}
