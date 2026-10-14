import { Hero } from './sections/Hero'
import { AtelierNews } from './sections/AtelierNews'
import { ShowcaseGallery } from './sections/ShowcaseGallery'
import { AtelierStatement } from './sections/AtelierStatement'
import { ProcessFilmstrip } from './sections/ProcessFilmstrip'
import { MakerFeature } from './sections/MakerFeature'
import { HomeCTA } from './sections/HomeCTA'

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
