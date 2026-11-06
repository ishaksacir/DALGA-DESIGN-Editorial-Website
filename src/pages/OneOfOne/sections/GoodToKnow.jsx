import { Reveal } from '@/components/ui/Reveal'
import { useI18n } from '@/i18n/context'

/** The four plain answers, as a two-by-two grid on ink. */
export function GoodToKnow() {
  const { t } = useI18n()
  const copy = t.oneOfOne.goodToKnow

  return (
    <section className="good-to-know">
      <Reveal className="good-to-know-head">
        <div>
          <p className="good-to-know-eyebrow">{copy.eyebrow}</p>
          <h2>{copy.title}</h2>
        </div>
        <p className="good-to-know-lead">{copy.lead}</p>
      </Reveal>
      <dl className="good-to-know-grid">
        {copy.answers.map((answer) => (
          <Reveal key={answer.label} className="good-to-know-item">
            <dt>{answer.label}</dt>
            <dd className="good-to-know-title">{answer.title}</dd>
            <dd className="good-to-know-text">{answer.description}</dd>
          </Reveal>
        ))}
      </dl>
    </section>
  )
}
