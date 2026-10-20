import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { Reveal } from '@/components/ui/Reveal'
import { ROUTES } from '@/constants/routes'
import { asset } from '@/constants/site'
import { PROCESS_IMAGES } from '@/data/process'
import { useI18n } from '@/i18n/context'
import { buzz } from '@/utils/haptics'
import { rafThrottle } from '@/utils/rafThrottle'

/** Height (share of the viewport) a row must be nearest to in order to be the active step. */
const FOCUS_LINE = 0.55
/** Beyond this distance from the focus line no row is active and all show at full strength. */
const FOCUS_RANGE = 0.45

/**
 * Home "Four steps", on ink over a faint atelier photo. The row nearest the middle of the screen
 * lights up as the page scrolls; the rest dim.
 */
export function PhoneSteps() {
  const { t } = useI18n()
  const copy = t.home.process
  const steps = t.phone.steps
  const listRef = useRef(null)
  const [active, setActive] = useState(-1)

  useEffect(() => {
    const update = rafThrottle(() => {
      const vh = window.innerHeight
      let best = -1
      let bestDistance = Infinity
      ;[...listRef.current.children].forEach((row, index) => {
        const { top, height } = row.getBoundingClientRect()
        const distance = Math.abs(top + height / 2 - vh * FOCUS_LINE)
        if (distance < bestDistance) {
          bestDistance = distance
          best = index
        }
      })
      setActive(bestDistance > vh * FOCUS_RANGE ? -1 : best)
    })
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      update.cancel()
    }
  }, [])

  return (
    <section className={`ph-steps${active >= 0 ? ' has-active' : ''}`}>
      <img
        className="ph-steps-bg"
        src={asset('home/atelier-hazy.webp')}
        alt=""
        aria-hidden="true"
        loading="lazy"
      />
      <Reveal className="ph-steps-head">
        <span className="ph-eyebrow">{steps.eyebrow}</span>
        <h2>
          {copy.title[0]}
          <br />
          <em>{copy.title[1]}</em>
        </h2>
        <p>{steps.intro}</p>
      </Reveal>
      <ol ref={listRef} className="ph-steps-list">
        {copy.stages.map((stage, index) => (
          <li key={stage.title} className={index === active ? 'active' : undefined}>
            <span className="ph-steps-n" aria-hidden="true">
              {index + 1}
            </span>
            <div className="ph-steps-top">
              <div>
                <span className="ph-steps-when">{stage.timing}</span>
                <span className="ph-steps-title">{stage.title}</span>
              </div>
              <img src={PROCESS_IMAGES[index]} alt="" loading="lazy" />
            </div>
            <p>{stage.description}</p>
          </li>
        ))}
      </ol>
      <Link className="ph-button light ph-press" to={ROUTES.ONE_OF_ONE} onClick={buzz}>
        <span>{steps.cta}</span>
        <span aria-hidden="true">→</span>
      </Link>
    </section>
  )
}
