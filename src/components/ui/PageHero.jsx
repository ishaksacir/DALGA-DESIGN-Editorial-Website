import { Reveal } from './Reveal'

/** Compact editorial header used at the top of secondary pages (About, Catalogue, One of one). */
export function PageHero({ eyebrow, title, description, centered = false, className = '' }) {
  const classes = [
    'page-hero',
    'compact',
    centered && 'centered',
    description && 'with-description',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (description) {
    return (
      <section className={classes}>
        <div className="page-hero-heading">
          <Reveal as="p">{eyebrow}</Reveal>
          <Reveal as="h1">{title}</Reveal>
        </div>
        <Reveal as="p" className="page-hero-description">
          {description}
        </Reveal>
      </section>
    )
  }

  return (
    <section className={classes}>
      <Reveal as="p">{eyebrow}</Reveal>
      <Reveal as="h1">{title}</Reveal>
    </section>
  )
}
