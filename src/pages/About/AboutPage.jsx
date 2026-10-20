import { usePhone } from '@/hooks/usePhone'

import { AboutPhone } from './AboutPhone'
import { AboutHero } from './sections/AboutHero'
import { AboutQuote } from './sections/AboutQuote'
import { AtelierStory } from './sections/AtelierStory'

export function AboutPage() {
  if (usePhone()) return <AboutPhone />

  return (
    <main className="about-page">
      <AboutHero />
      <AboutQuote />
      <AtelierStory />
    </main>
  )
}
