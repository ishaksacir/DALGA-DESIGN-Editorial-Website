import { useEffect, useState } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import { commissionSteps } from '@/data/commissionProcess'
import { asset } from '@/constants/site'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

const STEP_DURATION_MS = 4500

/** Auto-advancing walkthrough of the four commission stages. Shared by the Home and One of one pages. */
export function CommissionJourney() {
  const [active, setActive] = useState(0)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) return
    const timer = window.setTimeout(
      () => setActive((current) => (current + 1) % commissionSteps.length),
      STEP_DURATION_MS,
    )
    return () => window.clearTimeout(timer)
  }, [active, prefersReducedMotion])

  const step = commissionSteps[active]

  return (
    <section className="commission-journey snap-section">
      <Reveal className="commission-journey-card">
        <div className="commission-journey-heading">
          <div>
            <p>The commission process</p>
            <h2>
              Made around you,
              <br />
              <em>from the first line.</em>
            </h2>
          </div>
          <span>Four stages · one original</span>
        </div>
        <div className="commission-journey-body">
          <div className="commission-journey-copy" key={active}>
            <b>{step.number}</b>
            <h3>{step.label}</h3>
            <p>{step.description}</p>
          </div>
          <figure className="commission-journey-image" key={`image-${active}`}>
            <img src={asset(step.image)} alt={step.label} />
            <figcaption>
              <span>Dalga atelier</span>
              <span>{step.number} / 04</span>
            </figcaption>
          </figure>
        </div>
        <div className="commission-journey-nav">
          {commissionSteps.map((navStep, index) => (
            <button
              key={navStep.number}
              type="button"
              className={index === active ? 'active' : ''}
              onClick={() => setActive(index)}
              aria-label={`Show ${navStep.label}`}
              aria-current={index === active}
            >
              <b>{navStep.number}</b>
              <span>{navStep.label}</span>
            </button>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
