import { useEffect, useRef } from 'react'

import { asset } from '@/constants/site'
import { useI18n } from '@/i18n/context'
import { rafThrottle } from '@/utils/rafThrottle'

const DIM = '0.18'

/** "The atelier's rule", over a dimmed blur of the hero photo: the sentence fills in word by word as the section scrolls through. */
export function PhoneRule() {
  const { t } = useI18n()
  const copy = t.phone.rule
  const textRef = useRef(null)

  const words = [
    ...copy.before.split(' ').map((word) => ({ word })),
    ...copy.accent.split(' ').map((word) => ({ word, accent: true })),
    ...copy.after.split(' ').map((word) => ({ word })),
  ]

  useEffect(() => {
    const text = textRef.current
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const update = rafThrottle(() => {
      const { top, height } = text.getBoundingClientRect()
      const vh = window.innerHeight
      const progress = Math.min(1, Math.max(0, (vh * 0.82 - top) / (height + vh * 0.25)))
      const spans = text.children
      for (let i = 0; i < spans.length; i++) {
        spans[i].style.opacity = (i + 0.5) / spans.length <= progress * 1.08 ? '1' : DIM
      }
    })
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      update.cancel()
    }
  }, [t])

  return (
    <section className="ph-rule">
      <img
        className="ph-rule-bg"
        src={asset('home/hero-phone-sky.webp')}
        alt=""
        aria-hidden="true"
        loading="lazy"
      />
      <span
        className="ph-rule-mark"
        aria-hidden="true"
        style={{ '--mask': `url(${asset('brand/zenka-outline.png')})` }}
      />
      <p ref={textRef} className="ph-rule-text">
        {words.map(({ word, accent }, index) => (
          <span key={index} className={accent ? 'accent' : undefined}>
            {word}
          </span>
        ))}
      </p>
      <span className="ph-rule-label">{copy.label}</span>
    </section>
  )
}
