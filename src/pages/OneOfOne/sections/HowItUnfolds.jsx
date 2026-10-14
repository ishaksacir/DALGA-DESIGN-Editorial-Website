import { Reveal } from '@/components/ui/Reveal'
import { asset } from '@/constants/site'
import { useI18n } from '@/i18n/context'
import { twoDigits } from '@/utils/format'

/** Illustrations for the four stages; the copy for each lives in `oneOfOne.unfolds.stages`. */
const STAGE_IMAGES = [
  'unfolds-letter.png',
  'unfolds-dress.png',
  'unfolds-form.png',
  'unfolds-hanger.png',
]

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
          <Reveal as="article" key={STAGE_IMAGES[index]} className="unfolds-stage">
            <div className="unfolds-art">
              <img src={asset(STAGE_IMAGES[index])} alt={alt} loading="lazy" />
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
