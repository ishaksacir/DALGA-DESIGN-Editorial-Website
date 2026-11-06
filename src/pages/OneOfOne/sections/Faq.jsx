import { useState } from 'react'

import { useContactDrawer } from '@/components/contact/context'
import { Reveal } from '@/components/ui/Reveal'
import { useI18n } from '@/i18n/context'

/** "Asked often": questions as an accordion, one open at a time; the copy lives in `oneOfOne.faq`. */
export function Faq() {
  const { t } = useI18n()
  const copy = t.oneOfOne.faq
  const { openDrawer } = useContactDrawer()
  // -1 means all closed.
  const [openItem, setOpenItem] = useState(-1)

  return (
    <section className="faq">
      <Reveal className="faq-head">
        <p className="faq-eyebrow">{copy.eyebrow}</p>
        <h2>{copy.title}</h2>
        <p className="faq-more">
          {copy.more}{' '}
          <button type="button" onClick={() => openDrawer()}>
            {copy.write}
          </button>
          .
        </p>
      </Reveal>
      <div className="faq-list">
        {copy.items.map(({ question, answer }, index) => {
          const open = openItem === index
          const panelId = `faq-${index}`
          return (
            <Reveal key={question} className={`faq-item${open ? ' open' : ''}`}>
              <h3>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenItem(open ? -1 : index)}
                >
                  <span>{question}</span>
                  <span className="faq-sign" aria-hidden="true" />
                </button>
              </h3>
              {/* Kept mounted so the height can animate; `inert` keeps a closed answer out of reach. */}
              <div id={panelId} className="faq-panel" inert={!open}>
                <p>{answer}</p>
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
