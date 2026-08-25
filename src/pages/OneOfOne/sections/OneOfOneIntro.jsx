import { Reveal } from '@/components/ui/Reveal'
import { PageHero } from '@/components/ui/PageHero'

const GOOD_TO_KNOW = [
  {
    title: 'Timeline',
    description:
      'Six to ten weeks for most pieces. Occasion garments should be commissioned at least three months ahead.',
  },
  {
    title: 'Investment',
    description:
      'Quoted individually after the first conversation — based on fabric, construction and hours of handwork.',
  },
  {
    title: 'Materials',
    description:
      'Wool, linen and raw cotton by default; we can also work with a fabric that already means something to you.',
  },
  {
    title: 'The promise',
    description:
      'Your pattern is never reused — not in another size, not in another fabric, not for anyone else.',
  },
]

export function OneOfOneIntro() {
  return (
    <div className="oneofone-intro snap-section">
      <PageHero
        className="oneofone-hero"
        centered
        eyebrow="Commissions open for autumn 2026"
        title="One of one"
      />
      <section className="know section">
        <Reveal>
          <p className="kicker">Before we begin</p>
          <h2>Good to know</h2>
        </Reveal>
        <div className="info-grid">
          {GOOD_TO_KNOW.map((item, index) => (
            <Reveal key={item.title}>
              <b>0{index + 1}</b>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}
