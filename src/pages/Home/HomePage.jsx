import { Hero } from './sections/Hero'
import { ShowcaseGallery } from './sections/ShowcaseGallery'
import { AtelierFeature } from './sections/AtelierFeature'
import { HomeCTA } from './sections/HomeCTA'
import { CommissionJourney } from '@/components/sections/CommissionJourney'

export function HomePage() {
  return (
    <main>
      <Hero />
      <ShowcaseGallery />
      <CommissionJourney />
      <AtelierFeature />
      <HomeCTA />
    </main>
  )
}
