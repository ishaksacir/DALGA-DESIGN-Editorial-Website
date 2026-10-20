import { useContactDrawer } from '@/components/contact/context'
import { NeedleLink } from '@/components/ui/NeedleLink'
import { Reveal } from '@/components/ui/Reveal'
import { asset } from '@/constants/site'
import { useI18n } from '@/i18n/context'

/** The founder's portrait beside three short facts about the atelier and the invitation to write. */
export function AtelierStory() {
  const { t } = useI18n()
  const copy = t.about
  const { openDrawer } = useContactDrawer()

  return (
    <section className="atelier-story">
      <Reveal as="figure" className="atelier-story-image">
        <img src={asset('about/founder.webp')} alt={copy.imageAlt} loading="lazy" />
        <figcaption>{copy.caption}</figcaption>
      </Reveal>
      <Reveal className="atelier-story-copy">
        <dl className="atelier-story-facts">
          {copy.facts.map(([label, text]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{text}</dd>
            </div>
          ))}
        </dl>
        <NeedleLink onClick={() => openDrawer()}>{t.contact.triggerAction} →</NeedleLink>
      </Reveal>
    </section>
  )
}
