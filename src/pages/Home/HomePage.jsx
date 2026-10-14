import { AtelierNews } from './sections/AtelierNews'
import { AtelierStatement } from './sections/AtelierStatement'
import { Hero } from './sections/Hero'
import { HomeCTA } from './sections/HomeCTA'
import { MakerFeature } from './sections/MakerFeature'
import { ProcessFilmstrip } from './sections/ProcessFilmstrip'
import { ShowcaseGallery } from './sections/ShowcaseGallery'

export function HomePage() {
  return (
    <main>
      <Hero />
      <AtelierNews />
      <ShowcaseGallery />
      <AtelierStatement />
      <ProcessFilmstrip />
      <MakerFeature />
      <HomeCTA />
    </main>
  )
}
