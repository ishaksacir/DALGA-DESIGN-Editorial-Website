import { Reveal } from '@/components/ui/Reveal'
import { asset } from '@/constants/site'
import { useI18n } from '@/i18n/context'

/** The photograph on the catalogue cover. Not tied to a catalogue entry, so the credit is plain text. */
const COVER = {
  img: asset('catalogue/cover-green-coat.webp'),
  name: { bs: 'Maslinasti vuneni kaput', en: 'Olive wool coat' },
  alt: {
    bs: 'Maslinasti vuneni kaput sa stojećim ovratnikom i dubokim džepovima na krojačkoj lutki',
    en: 'Olive wool coat with a stand collar and deep pockets on a dress form',
  },
}

/** Editorial "magazine cover" header for the catalogue: featured piece on the right, oversized title cropped at the bottom. */
export function CatalogueCover() {
  const { t, tr } = useI18n()
  const copy = t.catalogue.cover

  return (
    <section className="catalogue-cover">
      <img
        className="catalogue-cover-image"
        src={COVER.img}
        alt={tr(COVER.alt)}
        fetchPriority="high"
      />
      <div className="catalogue-cover-meta">
        <p>
          <b>{copy.archive}</b>
          <span>2024 — 2026</span>
        </p>
        <p className="catalogue-cover-credit">
          <b>{copy.onTheCover}</b>
          <span>{tr(COVER.name)}</span>
        </p>
      </div>
      <Reveal as="p" className="catalogue-cover-lead">
        {copy.lead}
      </Reveal>
      <h1 className="catalogue-cover-title">{copy.title}</h1>
    </section>
  )
}
