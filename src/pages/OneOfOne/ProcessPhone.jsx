import { useState } from 'react'

import { useContactDrawer } from '@/components/contact/context'
import { LineBreaks } from '@/components/ui/LineBreaks'
import { Reveal } from '@/components/ui/Reveal'
import { PROCESS_IMAGES } from '@/data/process'
import { useI18n } from '@/i18n/context'
import { twoDigits } from '@/utils/format'
import { buzz } from '@/utils/haptics'

/** The "One of one" page on phones: the four steps as an accordion, one open at a time. */
export function ProcessPhone() {
  const { t } = useI18n()
  const copy = t.home.process
  const { openDrawer } = useContactDrawer()
  // Step 1 starts open; -1 means all closed.
  const [openStep, setOpenStep] = useState(0)
  const [openQuestion, setOpenQuestion] = useState(-1)
  const faq = t.oneOfOne.faq

  return (
    <main className="ph-page ph-process">
      <h1 className="ph-page-title">
        <LineBreaks lines={copy.title} />
      </h1>
      <p className="ph-page-lead">{t.phone.process.lead}</p>
      <div className="ph-accordion">
        {copy.stages.map((stage, index) => {
          const open = openStep === index
          const panelId = `ph-step-${index}`
          return (
            <Reveal key={stage.title} className={`ph-accordion-item${open ? ' open' : ''}`}>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => {
                  buzz()
                  setOpenStep(open ? -1 : index)
                }}
              >
                <span className="ph-accordion-n">{twoDigits(index + 1)}</span>
                <span className="ph-accordion-title">
                  <span>{stage.title}</span>
                  <span>{stage.timing}</span>
                </span>
                <span className="ph-accordion-sign" aria-hidden="true">
                  +
                </span>
              </button>
              {open && (
                <div id={panelId} className="ph-accordion-panel">
                  <img src={PROCESS_IMAGES[index]} alt={stage.alt} />
                  <p>{stage.description}</p>
                  <dl>
                    {stage.details.map(([label, value]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </Reveal>
          )
        })}
      </div>
      <button
        type="button"
        className="ph-button ph-press"
        onClick={() => {
          buzz()
          openDrawer()
        }}
      >
        <span>{t.phone.process.start}</span>
        <span aria-hidden="true">→</span>
      </button>
      <section className="ph-faq">
        <p className="ph-eyebrow">{faq.eyebrow}</p>
        <h2 className="ph-page-title">{faq.title}</h2>
        <div className="ph-accordion">
          {faq.items.map(({ question, answer }, index) => {
            const open = openQuestion === index
            const panelId = `ph-faq-${index}`
            return (
              <div key={question} className={`ph-accordion-item${open ? ' open' : ''}`}>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => {
                    buzz()
                    setOpenQuestion(open ? -1 : index)
                  }}
                >
                  <span className="ph-faq-question">{question}</span>
                  <span className="ph-accordion-sign" aria-hidden="true">
                    +
                  </span>
                </button>
                {open && (
                  <div id={panelId} className="ph-accordion-panel">
                    <p>{answer}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <p className="ph-faq-more">
          {faq.more}{' '}
          <button type="button" onClick={() => openDrawer()}>
            {faq.write}
          </button>
          .
        </p>
      </section>
    </main>
  )
}
