import { Reveal } from '@/components/ui/Reveal'
import { asset } from '@/constants/site'
import { useI18n } from '@/i18n/context'

export function MakerFeature() {
  const { t } = useI18n()
  const copy = t.home.maker

  return (
    <section className="maker-feature">
      <Reveal as="figure" className="maker-feature-image">
        <img src={asset('founder.jpg')} alt={copy.imageAlt} />
      </Reveal>
      <Reveal className="maker-feature-copy">
        <p className="maker-feature-eyebrow">{copy.eyebrow}</p>
        <blockquote>{copy.quote}</blockquote>
        <p className="maker-feature-credit">{copy.credit}</p>
        <div className="maker-feature-notes">
          {copy.notes.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
