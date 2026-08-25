import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from '@/components/ui/Reveal'
import { EyebrowRow } from '@/components/ui/EyebrowRow'
import { products } from '@/data/products'
import { productPath } from '@/constants/routes'

const VISIBLE_COUNT = Math.min(4, products.length)

export function ShowcaseGallery() {
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
        <EyebrowRow start="Selected work" end="2024 — 2026 · Each made once" />
        <div className="gallery-shell">
          <button
            type="button"
            className="gallery-arrow gallery-arrow-prev"
            aria-label="Show previous creations"
            onClick={() => moveShowcase(-1)}
          >
            ←
          </button>
          <Reveal className="gallery-window">
            <div className="gallery-track gallery-static">
              {visibleProducts.map((product) => (
                <Link key={product.id} className="gallery-item" to={productPath(product.id)}>
                  <img src={product.img} alt={product.alt} />
                  <span className="gallery-item-caption">
                    {product.collection} · {product.name}
                    <span>View →</span>
                  </span>
                </Link>
              ))}
            </div>
          </Reveal>
          <button
            type="button"
            className="gallery-arrow gallery-arrow-next"
            aria-label="Show next creations"
            onClick={() => moveShowcase(1)}
          >
            →
          </button>
        </div>
      </div>
    </section>
  )
}
