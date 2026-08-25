import { Reveal } from '@/components/ui/Reveal'

export function AtelierFeature() {
  return (
    <section className="atelier-feature">
      <div className="atelier-shade" />
      <Reveal className="atelier-copy">
        <p>Inside the atelier</p>
        <h2>
          Two pairs of
          <br />
          hands
        </h2>
        <span>
          Everything is cut and sewn on one table, in wool, linen and raw cotton — fabrics that age
          with the person wearing them.
        </span>
      </Reveal>
    </section>
  )
}
