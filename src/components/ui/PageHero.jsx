import { Reveal } from './Reveal'

/** Compact editorial header used at the top of secondary pages (About, Catalogue, One of one). */
export function PageHero({ eyebrow, title, centered = false, className = '' }) {
  const classes = ['page-hero', 'compact', centered && 'centered', className]
    .filter(Boolean)
    .join(' ')
  return (
    <section className={classes}>
      <Reveal as="p">{eyebrow}</Reveal>
      <Reveal as="h1">{title}</Reveal>
    </section>
  )
}
