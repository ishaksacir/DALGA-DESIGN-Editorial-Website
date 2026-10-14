import { Reveal } from '@/components/ui/Reveal'
import { useI18n } from '@/i18n/context'

export function AboutHero() {
  const { t } = useI18n()
  const copy = t.about.hero

  return (
    <header className="about-hero">
      <Reveal className="about-hero-meta">
        <span>{copy.label}</span>
        <span>{copy.number}</span>
      </Reveal>
      <Reveal as="h1">{copy.title}</Reveal>
    </header>
  )
}
