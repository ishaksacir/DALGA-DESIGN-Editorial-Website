import { LineBreaks } from '@/components/ui/LineBreaks'
import { Reveal } from '@/components/ui/Reveal'
import { asset } from '@/constants/site'
import { useI18n } from '@/i18n/context'

export function OneOfOneHero() {
  const { t } = useI18n()
  const copy = t.oneOfOne.hero

  return (
    <header className="oneofone-cover">
      <img
        className="oneofone-cover-image"
        src={asset('one-of-one/hero-heritage-print.webp')}
        alt={copy.imageAlt}
        fetchPriority="high"
      />
      <div className="oneofone-cover-content">
        <div className="oneofone-cover-status">
          <span className="oneofone-cover-open">{t.site.commissionsOpen}</span>
          <span>{copy.meta}</span>
        </div>
        <div className="oneofone-cover-body">
          <h1>
            <LineBreaks lines={copy.title} />
          </h1>
          <Reveal as="p">{copy.lead}</Reveal>
        </div>
      </div>
    </header>
  )
}
