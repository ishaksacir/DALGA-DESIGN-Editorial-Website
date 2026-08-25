import { useEffect, useRef } from 'react'

/**
 * Full-bleed hero with the DALGA / DESIGN wordmark zooming in as the page scrolls.
 * The parallax listener lives here (rather than globally) since it only ever
 * touches elements this component renders.
 */
export function Hero() {
  const dalgaRef = useRef(null)
  const designRef = useRef(null)

  useEffect(() => {
    let raf = null
    const applyZoom = () => {
      const viewportHeight = window.innerHeight || 1
      const progress = Math.min(1, window.scrollY / (viewportHeight * 0.9))
      const scale = 1 + progress * 1.35
      const opacity = Math.max(0, 1 - progress * 1.1)
      ;[dalgaRef.current, designRef.current].forEach((el) => {
        if (!el) return
        el.style.transform = `scale(${scale})`
        el.style.opacity = opacity
      })
      raf = null
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(applyZoom)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <header className="hero">
      <div className="hero-bg" />
      <div className="hero-word dalga" ref={dalgaRef}>
        DALGA
      </div>
      <div className="hero-cutout" />
      <h1 className="hero-word design" ref={designRef}>
        DESIGN
      </h1>
      <div className="hero-note left">
        Made for one.
        <br />
        Repeated for no one.
      </div>
      <div className="hero-note right">
        Custom garments designed
        <br />
        around your story.
      </div>
    </header>
  )
}
