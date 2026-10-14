import { NeedleLink } from '@/components/ui/NeedleLink'
import { Reveal } from '@/components/ui/Reveal'
import { SITE } from '@/constants/site'
import { news } from '@/data/news'
import { useI18n } from '@/i18n/context'

function NewsMeta({ category, date }) {
  const { tr } = useI18n()

  return (
    <p className="news-meta">
      <span className="news-meta-category">{tr(category)}</span>
      <span>{tr(date)}</span>
    </p>
  )
}

/** "New at the atelier": one featured story above a row of recent updates. */
export function AtelierNews() {
  const { t, tr } = useI18n()
  const [featured, ...recent] = news

  return (
    <section className="atelier-news">
      <Reveal className="atelier-news-head">
        <p>{t.home.news.heading}</p>
        <a href={SITE.instagram} target="_blank" rel="noreferrer">
          {t.home.news.allNews} <span aria-hidden="true">→</span>
        </a>
      </Reveal>

      <Reveal as="article" className="news-featured">
        <img src={featured.img} alt={tr(featured.alt)} />
        <div className="news-featured-body">
          <span className="news-tag">{t.home.news.justIn}</span>
          <NewsMeta category={featured.category} date={featured.date} />
          <h2>{tr(featured.title)}</h2>
          <p className="news-featured-excerpt">{tr(featured.excerpt)}</p>
          <NeedleLink
            className="news-read-more"
            needle="black"
            href={SITE.instagram}
            target="_blank"
            rel="noreferrer"
          >
            {t.home.news.readMore} →
          </NeedleLink>
        </div>
      </Reveal>

      <div className="news-grid">
        {recent.map((item) => (
          <Reveal as="article" key={item.id} className="news-card">
            {item.img ? (
              <img src={item.img} alt={tr(item.alt)} loading="lazy" />
            ) : (
              <div className="news-card-empty" aria-hidden="true" />
            )}
            <NewsMeta category={item.category} date={item.date} />
            <h3>{tr(item.title)}</h3>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
