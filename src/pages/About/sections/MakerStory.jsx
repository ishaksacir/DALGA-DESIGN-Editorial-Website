import { Reveal } from '@/components/ui/Reveal'
import { useI18n } from '@/i18n/context'

/** Sabiha, the maker: her name beside her motto and two short notes on how she works. */
export function MakerStory() {
  const { t } = useI18n()
  const copy = t.aboutMaker

  return (
    <section className="maker-story">
      <Reveal className="maker-story-head">
        <p className="maker-story-eyebrow">{copy.eyebrow}</p>
        <h2>
          {copy.name} <span>{copy.surname}</span>
        </h2>
        <p className="maker-story-role">{copy.role}</p>
      </Reveal>
      <div className="maker-story-body">
        <Reveal as="p" className="maker-story-motto">
          {copy.motto}
        </Reveal>
        <dl className="maker-story-notes">
          {copy.notes.map(([label, text]) => (
            <Reveal key={label}>
              <dt>{label}</dt>
              <dd>{text}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}
