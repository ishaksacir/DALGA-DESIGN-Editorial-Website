import { useEffect, useRef } from 'react'

import { asset } from '@/constants/site'
import { useI18n } from '@/i18n/context'

/** Width (px) of the figure window and outline before it opens. */
const FIGURE = 150
/** Share of the hero's height scrolled by the time the figure is fully open. */
const ZOOM_END = 0.5
/** Scale of the figure when fully open. It grows exponentially (MAX_SCALE ** progress), so the
 *  zoom looks equally fast at every point instead of crawling at first and rushing at the end. */
const MAX_SCALE = 45

const HERO = asset('home/hero-phone-sky.webp')

/**
 * Full-screen hero. It opens on a blurred copy of the photo with the atelier's figure cut out, so
 * the sharp photo shows through. As the page scrolls, the figure zooms open in step with the
 * finger until the whole photo is sharp, and the caption fades out over the first third of it.
 * The hero is never pinned: it scrolls natively the whole time, and scrolling back up closes the
 * figure again.
 */
export function PhoneHero() {
  const { t } = useI18n()
  const heroRef = useRef(null)
  const introRef = useRef(null)
  const blurRef = useRef(null)
  const outlineRef = useRef(null)
  const footRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const hero = heroRef.current
    const intro = introRef.current
    const blur = blurRef.current
    const outline = outlineRef.current
    const foot = footRef.current
    let frame = 0
    let last = -1

    const render = () => {
      frame = 0
      const distance = hero.offsetHeight * ZOOM_END
      const progress = Math.min(1, Math.max(0, window.scrollY / distance))
      if (progress === last) return
      last = progress
      const scale = MAX_SCALE ** progress
      const size = `${(FIGURE * scale).toFixed(1)}px auto, 100% 100%`
      blur.style.webkitMaskSize = size
      blur.style.maskSize = size
      blur.style.opacity = progress > 0.8 ? (1 - progress) / 0.2 : 1
      outline.style.transform = `translate(-50%, -50%) scale(${scale})`
      outline.style.opacity = Math.max(0, 1 - progress / 0.6)
      foot.style.opacity = Math.max(0, 1 - progress / 0.3)
      // Fully open: take the overlay out of painting altogether.
      intro.style.visibility = progress === 1 ? 'hidden' : ''
    }
    // Passive and rAF-batched: the zoom reads the scroll position, it never steers the scroll.
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(render)
    }
    render()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <header ref={heroRef} className="ph-hero">
      <div className="ph-hero-stage">
        <img className="ph-hero-bg" src={HERO} alt="" fetchPriority="high" />
        <div ref={introRef} className="ph-hero-intro" aria-hidden="true">
          <div
            ref={blurRef}
            className="ph-hero-blur"
            style={{ '--figure': `url(${asset('brand/zenka-fill.png')})` }}
          >
            <img src={HERO} alt="" />
          </div>
          <img
            ref={outlineRef}
            className="ph-hero-outline"
            src={asset('brand/zenka-outline.png')}
            alt=""
          />
        </div>
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
