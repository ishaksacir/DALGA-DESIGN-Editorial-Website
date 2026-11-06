import { Reveal } from './Reveal'

/** Compact editorial header: eyebrow over a large serif title. */
export function PageHero({ eyebrow, title, className = '' }) {
  return (
    <section className={`page-hero compact ${className}`}>
      <Reveal as="p">{eyebrow}</Reveal>
      <Reveal as="h1">{title}</Reveal>
    </section>
  )
}
