import { useContactDrawer } from '@/components/contact/context'
import { LineBreaks } from '@/components/ui/LineBreaks'
import { NeedleLink } from '@/components/ui/NeedleLink'
import { Reveal } from '@/components/ui/Reveal'
import { asset } from '@/constants/site'
import { useI18n } from '@/i18n/context'

export function CommissionCTA() {
  const { t } = useI18n()
  const copy = t.oneOfOne.cta
  const { openDrawer } = useContactDrawer()

  return (
    <section className="begin-commission">
      <Reveal as="figure" className="begin-commission-image">
        <img src={asset('atelier-linen.jpg')} alt={copy.imageAlt} />
      </Reveal>
      <Reveal className="begin-commission-copy">
        <p className="begin-commission-eyebrow">{copy.eyebrow}</p>
        <h2>
          <LineBreaks lines={copy.title} />
          <br />
          <span>{copy.titleAccent}</span>
        </h2>
        <p className="begin-commission-text">{copy.text}</p>
        <NeedleLink className="needle-btn begin-commission-btn" onClick={() => openDrawer()}>
          {copy.link}
        </NeedleLink>
      </Reveal>
    </section>
  )
}
