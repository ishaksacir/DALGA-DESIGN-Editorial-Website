import { useContactDrawer } from '@/components/contact/context'
import { Reveal } from '@/components/ui/Reveal'
import { asset } from '@/constants/site'
import { useI18n } from '@/i18n/context'

export function HomeCTA() {
  const { t } = useI18n()
  const copy = t.home.cta
  const { openDrawer } = useContactDrawer()

  return (
    <section className="home-cta">
      <div className="home-cta-status">
        <span className="home-cta-open">{copy.open}</span>
        <span>{copy.season}</span>
      </div>
      <div className="home-cta-body">
        <Reveal as="h2">
          {copy.title}
          <br />
          <span>{copy.titleAccent}</span>
        </Reveal>
        <Reveal>
          <ol className="home-cta-steps">
            {copy.steps.map((step) => (
              <li key={step.label}>
                <b>{step.label}</b>
                <span>{step.text}</span>
              </li>
            ))}
          </ol>
          <button type="button" className="home-cta-bar" onClick={() => openDrawer()}>
            <span>{t.contact.trigger}</span>
            {/* On hover only this half swaps its label for the needle; "Get your piece" stays. */}
            <span className="home-cta-bar-action">
              <span>{t.contact.triggerAction}&nbsp;&nbsp;→</span>
              <img src={asset('ui/needle-white.png')} alt="" />
            </span>
          </button>
        </Reveal>
      </div>
    </section>
  )
}
