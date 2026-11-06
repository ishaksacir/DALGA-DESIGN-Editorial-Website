import { Reveal } from '@/components/ui/Reveal'
import { useI18n } from '@/i18n/context'

/** A quiet masthead on paper: the open-commissions status, the title and the one-line lead. */
export function OneOfOneHero() {
  const { t } = useI18n()
  const copy = t.oneOfOne.hero

  return (
    <header className="oneofone-hero">
      <p className="oneofone-hero-status">{t.site.commissionsOpen}</p>
      <div className="oneofone-hero-body">
        <h1>{copy.title}</h1>
        <Reveal as="p">{copy.lead}</Reveal>
      </div>
    </header>
  )
}
