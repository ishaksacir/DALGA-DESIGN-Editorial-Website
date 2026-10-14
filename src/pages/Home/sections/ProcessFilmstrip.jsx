import { useEffect, useRef, useState } from 'react'
import { asset } from '@/constants/site'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useI18n } from '@/i18n/context'

/** Illustrations for the four stages; the copy for each lives in `home.process.stages`. */
const STAGE_IMAGES = [
  'process-line-conversation.png',
  'process-line-concept.png',
  'process-line-fittings.png',
  'process-line-yours.png',
]
const LAST_STEP = STAGE_IMAGES.length - 1
/** Vertical scroll (in viewport heights) between two steps. The section is one screen plus
 *  that distance per step, so the last step lands exactly as the section releases. */
const STEP_VH = 90
const PINNED_VH = 100 + LAST_STEP * STEP_VH
/** Share of each step's scroll at either end where the track holds still — the gentle "magnet"
 *  that lets a panel settle fully on screen before the next one starts to move. */
const DWELL = 0.12

const settle = (t) => {
  if (t <= DWELL) return 0
  if (t >= 1 - DWELL) return 1
  const u = (t - DWELL) / (1 - 2 * DWELL)
  return u * u * (3 - 2 * u)
}

/**
 * "How a piece is made". From 720px up the section pins and the row of four step panels follows
 * the vertical scroll, easing to rest on each step; light scroll-snap points add a soft pull when
 * the reader stops near one. First and last panels sit flush with the screen edge, the middle ones
 * centre. Narrower screens get a plain stack.
 */
export function ProcessFilmstrip() {
  const { t } = useI18n()
  const copy = t.home.process
  const pinned = useMediaQuery('(min-width: 720px)')
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const [step, setStep] = useState(0)
  const [revealed, setRevealed] = useState(-1)

  useEffect(() => {
    const track = trackRef.current
    if (!pinned) {
      track.style.transform = ''
      for (const panel of track.children) panel.style.opacity = ''
      return
    }
    let frame = null
    let offsets = []

    // Resting x-offset for each step: flush left, centred, centred, flush right.
    const measure = () => {
      const panel = track.firstElementChild.offsetWidth
      const viewport = track.parentElement.clientWidth
      const max = Math.max(0, track.children.length * panel - viewport)
      offsets = [...track.children].map((_, i) =>
        Math.min(max, Math.max(0, i * panel - (viewport - panel) / 2)),
      )
    }

    const update = () => {
      frame = null
      const rect = sectionRef.current.getBoundingClientRect()
      const stepPx = (window.innerHeight * STEP_VH) / 100
      const raw = Math.min(LAST_STEP, Math.max(0, -rect.top) / stepPx)
      const from = Math.min(Math.floor(raw), LAST_STEP - 1)
      const pos = from + settle(raw - from)

      const shift = offsets[from] + (offsets[from + 1] - offsets[from]) * (pos - from)
      track.style.transform = `translateX(${-shift}px)`
      // A panel fades as it leaves to the left, so no half-cut copy rests at the edge.
      ;[...track.children].forEach((panel, i) => {
        panel.style.opacity = i >= pos ? '' : String(Math.max(0, 1 - (pos - i) * 1.6))
      })

      setStep(Math.round(pos))
      // Panels draw in as they approach and stay drawn when scrolling back.
      if (rect.top < window.innerHeight * 0.5) {
        const next = Math.min(LAST_STEP, Math.floor(pos + 0.75))
        setRevealed((prev) => Math.max(prev, next))
      }
    }
    const schedule = () => {
      if (frame === null) frame = requestAnimationFrame(update)
    }
    const onResize = () => {
      measure()
      schedule()
    }

    measure()
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', onResize)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [pinned])

  const isOn = (index) => !pinned || index <= revealed

  return (
    <section
      ref={sectionRef}
      className={`process${pinned ? ' is-pinned' : ''}`}
      style={pinned ? { height: `${PINNED_VH}vh` } : undefined}
    >
      {pinned && (
        <div className="process-snaps" aria-hidden="true">
          {STAGE_IMAGES.map((image, index) => (
            <span key={image} style={{ top: `${index * STEP_VH}vh` }} />
          ))}
        </div>
      )}
      <div className="process-frame">
        <div className="process-head">
          <div>
            <p className="process-eyebrow">{copy.eyebrow}</p>
            <h2>
              {copy.title[0]}
              <br />
              {copy.title[1]}
            </h2>
          </div>
          <p className="process-lead">{copy.lead}</p>
        </div>

        <div className="process-viewport">
          <div ref={trackRef} className="process-track">
            {copy.stages.map((stage, index) => (
              <article
                key={STAGE_IMAGES[index]}
                className={`process-panel${isOn(index) ? ' on' : ''}`}
              >
                <div className="process-art">
                  <span className="process-ghost" aria-hidden="true">
                    {index + 1}
                  </span>
                  <img src={asset(STAGE_IMAGES[index])} alt={stage.alt} loading="lazy" />
                </div>
                <div className="process-text">
                  <span className="process-week">{stage.timing}</span>
                  <span className="process-number" aria-hidden="true">
                    {index + 1}
                  </span>
                  <h3>{stage.title}</h3>
                  <p>{stage.description}</p>
                  <dl className="process-details">
                    {stage.details.map(([label, value]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </article>
            ))}
          </div>
        </div>

        {pinned && (
          <div className="process-progress" aria-hidden="true">
            <span className="process-counter">
              0{step + 1} <span>/ 0{LAST_STEP + 1}</span>
            </span>
            <div className="process-bars">
              {STAGE_IMAGES.map((image, index) => (
                <span key={image} className={index <= step ? 'filled' : ''} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
