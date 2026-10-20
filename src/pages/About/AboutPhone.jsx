import { useContactDrawer } from '@/components/contact/context'
import { Reveal } from '@/components/ui/Reveal'
import { asset } from '@/constants/site'
import { useI18n } from '@/i18n/context'
import { buzz } from '@/utils/haptics'
import { unquote } from '@/utils/unquote'

/**
 * About on phones: the title, a full-bleed portrait of the founder, her line on an ink band,
 * three short facts and the invitation to write.
 */
export function AboutPhone() {
  const { t } = useI18n()
  const copy = t.about
  const maker = t.home.maker
  const { openDrawer } = useContactDrawer()

  return (
    <main className="ph-about-page">
      <div className="ph-about-intro">
        <span className="ph-eyebrow">{copy.eyebrow}</span>
        <h1>
          {copy.title} <em>{copy.titleAccent}</em>
        </h1>
        <p>{maker.notes[0]}</p>
      </div>
      <figure className="ph-about-figure">
        <Reveal as="img" src={asset('about/founder.webp')} alt={copy.imageAlt} />
        <figcaption>{copy.caption}</figcaption>
      </figure>
      <Reveal as="blockquote" className="ph-about-quote">
        <span aria-hidden="true">“</span>
        <p>{unquote(maker.quote)}</p>
        <span>{t.phone.about.credit}</span>
      </Reveal>
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
