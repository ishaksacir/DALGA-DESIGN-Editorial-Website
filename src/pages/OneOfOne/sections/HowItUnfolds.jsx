import { Reveal } from '@/components/ui/Reveal'
import { PROCESS_IMAGES } from '@/data/process'
import { useI18n } from '@/i18n/context'
import { twoDigits } from '@/utils/format'

/** The four stages, each with its process drawing; the copy lives in `oneOfOne.unfolds.stages`. */
export function HowItUnfolds() {
  const { t } = useI18n()
  const copy = t.oneOfOne.unfolds

  return (
    <section className="unfolds">
      <div className="unfolds-head">
        <p>{copy.heading}</p>
        <p>{copy.meta}</p>
      </div>
      <div className="unfolds-grid">
        {copy.stages.map(({ title, timing, description, alt }, index) => (
          <Reveal as="article" key={PROCESS_IMAGES[index]} className="unfolds-stage">
            <div className="unfolds-art">
              <img src={PROCESS_IMAGES[index]} alt={alt} loading="lazy" />
            </div>
            <div className="unfolds-meta">
              <h3>
                {copy.stage} {twoDigits(index + 1)} · {title}
              </h3>
              <span>{timing}</span>
            </div>
            <p>{description}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
