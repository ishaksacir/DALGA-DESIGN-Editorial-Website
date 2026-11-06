import { usePhone } from '@/hooks/usePhone'

import { HomePhone } from './phone/HomePhone'
import { AtelierNews } from './sections/AtelierNews'
import { AtelierStatement } from './sections/AtelierStatement'
import { Hero } from './sections/Hero'
import { HomeCTA } from './sections/HomeCTA'
import { MakerFeature } from './sections/MakerFeature'
import { ProcessFilmstrip } from './sections/ProcessFilmstrip'
import { ShowcaseGallery } from './sections/ShowcaseGallery'

export function HomePage() {
  const isPhone = usePhone()
  if (isPhone) return <HomePhone />

  return (
    <main>
      <Hero />
      <ShowcaseGallery />
      <div className="fabric-strip" aria-hidden="true" />
      <AtelierNews />
      <div className="fabric-strip fabric-strip-below" aria-hidden="true" />
      <AtelierStatement />
      <div className="fabric-strip" aria-hidden="true" />
      <ProcessFilmstrip />
      <div className="fabric-strip fabric-strip-below" aria-hidden="true" />
      <MakerFeature />
      <HomeCTA />
    </main>
  )
}
