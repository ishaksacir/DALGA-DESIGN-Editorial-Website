import { useEffect, useRef, useState } from 'react'

import { Mark } from '@/components/ui/Mark'
import { NeedleLink } from '@/components/ui/NeedleLink'
import { Reveal } from '@/components/ui/Reveal'
import { SITE } from '@/constants/site'
import { useAtelierNews } from '@/hooks/useAtelierNews'
import { useReveal } from '@/hooks/useReveal'
import { useI18n } from '@/i18n/context'

/** How long each post stays featured before the next one rotates in. */
const ROTATE_MS = 7000

function NewsMeta({ category, date }) {
  return (
    <p className="news-meta">
      <span className="news-meta-category">{category}</span>
      <span>{date}</span>
    </p>
  )
}

/**
 * "New at the atelier": the featured post rotates through every post. Rotation pauses while keyboard focus is inside
 * the section, so tabbing to a link doesn't swap it out from under the reader.
 */
export function AtelierNews() {
  const { t } = useI18n()
  const sectionRef = useRef(null)
  const posts = useAtelierNews()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  // Posts arrive after the first render, so pick up their `.reveal` nodes once they mount.
  useReveal([posts[0].id], sectionRef)

  const count = posts.length
  const current = active % count
  const featured = posts[current]
  const rotating = count > 1 && !paused

  // A timeout per post (not an interval), so picking one by hand restarts its full turn.
  useEffect(() => {
    if (!rotating) return
    const timer = setTimeout(() => setActive((index) => (index + 1) % count), ROTATE_MS)
    return () => clearTimeout(timer)
  }, [rotating, current, count])

  // Mouse clicks focus the pager buttons too; only keyboard focus should hold the rotation.
  const pause = (event) => {
    if (event.target.matches(':focus-visible')) setPaused(true)
  }
  const resume = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false)
  }

  return (
    <section className="atelier-news" ref={sectionRef} onFocus={pause} onBlur={resume}>
      <Reveal className="atelier-news-head">
        <p className="mark-row">
          <Mark name="crescent" size={24} color="var(--accent-on-dark)" />
          {t.home.news.heading}
        </p>
        <a href={SITE.instagram} target="_blank" rel="noreferrer">
          {t.home.news.allNews} <span aria-hidden="true">→</span>
        </a>
      </Reveal>

      <Reveal as="article" className="news-featured" aria-live={rotating ? 'off' : 'polite'}>
        <div className="news-featured-media">
          <img key={featured.id} src={featured.img} alt={featured.alt} loading="lazy" />
          <svg className="news-stitch-frame" aria-hidden="true">
            <rect width="100%" height="100%" />
          </svg>
        </div>
        <div className="news-featured-body">
          <div key={featured.id} className="news-featured-text">
            <span className="news-tag">{t.home.news.justIn}</span>
            <NewsMeta category={featured.category} date={featured.date} />
            <h2>{featured.title}</h2>
            {featured.excerpt && <p className="news-featured-excerpt">{featured.excerpt}</p>}
            <NeedleLink
              className="news-read-more"
              needle="black"
              href={featured.href}
              target="_blank"
              rel="noreferrer"
            >
              {t.home.news.readMore} →
            </NeedleLink>
          </div>
          {count > 1 && (
            <div
              className={`news-pager${rotating ? ' is-rotating' : ''}`}
              style={{ '--news-rotate': `${ROTATE_MS}ms` }}
            >
              {posts.map((post, index) => (
                <button
                  key={post.id}
                  type="button"
                  className={index === current ? 'is-active' : undefined}
                  aria-label={`${t.home.news.showPost} ${index + 1}`}
                  aria-current={index === current ? 'true' : undefined}
                  onClick={() => setActive(index)}
                >
                  <span key={index === current ? featured.id : undefined} />
                </button>
              ))}
            </div>
          )}
        </div>
      </Reveal>
    </section>
  )
}
