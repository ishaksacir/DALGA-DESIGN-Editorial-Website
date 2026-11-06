import { Reveal } from '@/components/ui/Reveal'
import { useI18n } from '@/i18n/context'

export function AboutHero() {
  const { t } = useI18n()
  const copy = t.about

  return (
    <header className="about-hero">
      <Reveal as="p" className="about-hero-meta">
        {copy.eyebrow}
      </Reveal>
      <Reveal as="h1">
        {copy.title} <em>{copy.titleAccent}</em>
      </Reveal>
    </header>
  )
}
