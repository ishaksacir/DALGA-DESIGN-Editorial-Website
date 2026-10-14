import { useContactDrawer } from '@/components/contact/context'
import { Reveal } from '@/components/ui/Reveal'
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
        <Reveal as="ol" className="home-cta-steps">
          {copy.steps.map((step) => (
            <li key={step.label}>
              <b>{step.label}</b>
              <span>{step.text}</span>
            </li>
          ))}
        </Reveal>
      </div>
      <button type="button" className="home-cta-bar" onClick={() => openDrawer()}>
        <span>{t.contact.trigger}</span>
        <span>{t.contact.triggerAction}&nbsp;&nbsp;→</span>
      </button>
    </section>
  )
}
