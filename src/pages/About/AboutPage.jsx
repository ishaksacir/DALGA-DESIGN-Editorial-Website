import { Reveal } from '@/components/ui/Reveal'
import { PageHero } from '@/components/ui/PageHero'
import { asset } from '@/constants/site'

export function AboutPage() {
  return (
    <main>
      <PageHero className="about-hero" eyebrow="About the atelier" title="Dalga means wave." />
      <section className="split section">
        <Reveal>
          <p className="lead">
            A movement that keeps its shape while never standing still. That is how we think about
            clothing.
          </p>
          <p>
            DALGA is a small independent atelier creating garments for one person at a time. We
            begin with a story, not a trend, and build slowly around the body that will wear it.
          </p>
          <p>
            Each pattern is drafted once, cut once and archived. No reruns. No collections. No two
            people wearing the same thing.
          </p>
        </Reveal>
        <Reveal as="figure">
          <img src={asset('founder.jpg')} alt="Founder of DALGA DESIGN" />
        </Reveal>
      </section>
    </main>
  )
}
