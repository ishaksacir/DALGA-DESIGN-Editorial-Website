import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from '@/components/ui/Reveal'
import { EyebrowRow } from '@/components/ui/EyebrowRow'
import { products } from '@/data/products'
import { productPath } from '@/constants/routes'
import { useI18n } from '@/i18n/context'

const VISIBLE_COUNT = Math.min(4, products.length)

export function ShowcaseGallery() {
  const { t, tr } = useI18n()
  const [startIndex, setStartIndex] = useState(0)

  const visibleProducts = Array.from(
    { length: VISIBLE_COUNT },
    (_, i) => products[(startIndex + i) % products.length],
  )
  const moveShowcase = (direction) =>
    setStartIndex((current) => (current + direction + products.length) % products.length)

  return (
    <section className="gallery section">
      <div className="showcase-pattern-panel">
        <EyebrowRow start={t.home.showcase.title} end={t.home.showcase.meta} />
        <div className="gallery-shell">
          <button
            type="button"
            className="gallery-arrow gallery-arrow-prev"
            aria-label={t.home.showcase.previous}
            onClick={() => moveShowcase(-1)}
          >
            ←
          </button>
          <Reveal className="gallery-window">
            <div className="gallery-track gallery-static">
              {visibleProducts.map((product) => (
                <Link key={product.id} className="gallery-item" to={productPath(product.id)}>
                  <img src={product.img} alt={tr(product.alt)} />
                  <span className="gallery-item-caption">
                    {tr(product.collection)} · {tr(product.name)}
                    <span>{t.home.showcase.view}</span>
                  </span>
                </Link>
              ))}
            </div>
          </Reveal>
          <button
            type="button"
            className="gallery-arrow gallery-arrow-next"
            aria-label={t.home.showcase.next}
            onClick={() => moveShowcase(1)}
          >
            →
          </button>
        </div>
      </div>
    </section>
  )
}
