import { usePhone } from '@/hooks/usePhone'

import { AboutPhone } from './AboutPhone'
import { AboutHero } from './sections/AboutHero'
import { AtelierStory } from './sections/AtelierStory'
import { MakerStory } from './sections/MakerStory'

export function AboutPage() {
  if (usePhone()) return <AboutPhone />

  return (
    <main className="about-page">
      <AboutHero />
      <MakerStory />
      <AtelierStory />
    </main>
  )
}
