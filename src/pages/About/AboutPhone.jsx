import { useContactDrawer } from '@/components/contact/context'
import { Reveal } from '@/components/ui/Reveal'
import { asset } from '@/constants/site'
import { useI18n } from '@/i18n/context'
import { buzz } from '@/utils/haptics'

/**
 * About on phones: the title, a full-bleed portrait of the founder, her story,
 * three short facts and the invitation to write.
 */
export function AboutPhone() {
  const { t } = useI18n()
  const copy = t.about
  const story = t.aboutMaker
  const { openDrawer } = useContactDrawer()

  return (
    <main className="ph-about-page">
      <div className="ph-about-intro">
        <span className="ph-eyebrow">{copy.eyebrow}</span>
        <h1>
          {copy.title} <em>{copy.titleAccent}</em>
        </h1>
      </div>
      <figure className="ph-about-figure">
        <Reveal as="img" src={asset('about/founder.webp')} alt={copy.imageAlt} />
        <figcaption>{copy.caption}</figcaption>
      </figure>
      <section className="ph-about-maker">
        <span className="ph-eyebrow">{story.eyebrow}</span>
        <h2>
          {story.name} <span>{story.surname}</span>
        </h2>
        <p className="ph-about-maker-motto">{story.motto}</p>
        {story.notes.map(([label, text]) => (
          <Reveal key={label} className="ph-about-maker-note">
            <h3>{label}</h3>
            <p>{text}</p>
          </Reveal>
        ))}
      </section>
      <dl className="ph-about-facts">
        {copy.facts.map(([label, text]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{text}</dd>
          </div>
        ))}
      </dl>
      <div className="ph-about-action">
        <button
          type="button"
          className="ph-button ph-press"
          onClick={() => {
            buzz()
            openDrawer()
          }}
        >
          <span>{t.contact.trigger}</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </main>
  )
}
