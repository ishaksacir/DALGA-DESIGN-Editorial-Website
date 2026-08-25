import { Reveal } from '@/components/ui/Reveal'
import { NeedleLink } from '@/components/ui/NeedleLink'
import { ROUTES } from '@/constants/routes'
import { SITE } from '@/constants/site'

export function HomeCTA() {
  return (
    <section className="home-cta">
      <div className="home-cta-inner">
        <Reveal as="p" className="kicker">
          {SITE.commissionsOpen}
        </Reveal>
        <Reveal as="h2">Get your piece</Reveal>
        <Reveal as="p" className="home-cta-copy">
          One conversation is all it takes to begin. Nothing is decided until you have seen it drawn
          — from first sketch to final fitting, every step happens with you.
        </Reveal>
        <Reveal className="home-cta-actions">
          <NeedleLink dark to={ROUTES.ONE_OF_ONE}>
            One of one →
          </NeedleLink>
          <a className="home-cta-email" href={`mailto:${SITE.email}`}>
            {SITE.email}
          </a>
        </Reveal>
      </div>
    </section>
  )
}
