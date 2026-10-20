import { useRef } from 'react'

import { Reveal } from '@/components/ui/Reveal'
import { useAtelierNews } from '@/hooks/useAtelierNews'
import { useReveal } from '@/hooks/useReveal'
import { useI18n } from '@/i18n/context'

/** "New at the atelier": a rail of recent posts. Entries without a photo yet are left out. */
export function PhoneNews() {
  const { t } = useI18n()
  const sectionRef = useRef(null)
  const items = useAtelierNews().filter((item) => item.img)
  // Instagram posts arrive after the first render, so pick up their `.reveal` nodes once they mount.
  useReveal([items[0]?.id], sectionRef)

  return (
    <section className="ph-news" ref={sectionRef}>
      <Reveal className="ph-section-head">
        <h2>{t.home.news.heading}</h2>
        <span className="ph-status">{t.home.news.justIn}</span>
      </Reveal>
      <div className="ph-rail ph-news-rail">
        {items.map((item) => (
          <a
            key={item.id}
            className="ph-news-card"
            href={item.href}
            target="_blank"
            rel="noreferrer"
          >
            <Reveal as="span" className="ph-news-media reveal-clip">
              <img src={item.img} alt={item.alt} loading="lazy" />
            </Reveal>
            <span className="ph-news-meta">
              {item.category} · {item.date}
            </span>
            <span className="ph-news-title">{item.title}</span>
          </a>
        ))}
      </div>
    </section>
  )
}
