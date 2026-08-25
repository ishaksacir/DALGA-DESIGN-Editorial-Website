import { Reveal } from '@/components/ui/Reveal'
import { NeedleLink } from '@/components/ui/NeedleLink'
import { asset, SITE } from '@/constants/site'

export function CommissionCTA() {
  return (
    <section className="commission-cta snap-section">
      <div className="commission-media">
        <img
          src={asset('commission-pattern.jpg')}
          alt="Hand-painted wave motif, the DALGA signature pattern"
        />
      </div>
      <div className="commission-panel">
        <Reveal as="p" className="kicker">
          Begin your commission
        </Reveal>
        <Reveal as="h2">Tell us the story your garment should carry</Reveal>
        <Reveal as="p" className="commission-copy">
          Write a few lines about you, the occasion and what you imagine. Photos, sketches and
          half-formed ideas are all welcome — we answer every letter personally, within a week.
        </Reveal>
        <Reveal className="commission-actions">
          <NeedleLink dark href={`mailto:${SITE.email}`}>
            Begin a conversation
          </NeedleLink>
          <a className="commission-email" href={`mailto:${SITE.email}`}>
            {SITE.email}
          </a>
        </Reveal>
        <Reveal className="commission-meta">
          <span>{SITE.commissionsOpen}</span>
          <a href={SITE.instagram} target="_blank" rel="noreferrer">
            Follow the atelier →
          </a>
        </Reveal>
      </div>
    </section>
  )
}
