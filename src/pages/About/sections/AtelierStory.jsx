import { Reveal } from '@/components/ui/Reveal'
import { asset } from '@/constants/site'
import { useI18n } from '@/i18n/context'

export function AtelierStory() {
  const { t } = useI18n()
  const copy = t.about.story

  return (
    <section className="atelier-story">
      <Reveal as="figure" className="atelier-story-image">
        <img src={asset('founder.jpg')} alt={copy.imageAlt} />
        <figcaption>
          <span>{copy.caption}</span>
          <span>{copy.captionEnd}</span>
        </figcaption>
      </Reveal>
      <Reveal className="atelier-story-copy">
        <h2>
          {copy.title} <span>{copy.titleAside}</span>
        </h2>
        <div className="atelier-story-notes">
          {copy.notes.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
