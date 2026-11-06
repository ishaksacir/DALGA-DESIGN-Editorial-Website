import { useState } from 'react'
import { Link } from 'react-router-dom'

import { EyebrowRow } from '@/components/ui/EyebrowRow'
import { Mark } from '@/components/ui/Mark'
import { Reveal } from '@/components/ui/Reveal'
import { productPath, ROUTES } from '@/constants/routes'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useProducts } from '@/hooks/useProducts'
import { useI18n } from '@/i18n/context'

/** Below this width the four tiles become a swipeable row of every piece (see showcase.css). */
const SWIPE_GALLERY = '(max-width: 800px)'

export function ShowcaseGallery() {
  const { t, tr } = useI18n()
  const [startIndex, setStartIndex] = useState(0)
  const isSwipe = useMediaQuery(SWIPE_GALLERY)
  const products = useProducts()
  const visibleCount = Math.min(4, products.length)

  const visibleProducts = isSwipe
    ? products
    : Array.from({ length: visibleCount }, (_, i) => products[(startIndex + i) % products.length])
  const moveShowcase = (direction) =>
    setStartIndex((current) => (current + direction + products.length) % products.length)

  return (
    <section className="gallery section">
      <div className="showcase-pattern-panel">
        <EyebrowRow
          start={t.home.showcase.title}
          end={t.home.showcase.meta}
          mark={<Mark name="rosette" size={22} color="var(--accent)" />}
        />
        {/* Arrows sit in their own columns either side of the tiles, never over a photo. */}
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
                  <img src={product.img} alt={tr(product.alt)} loading="lazy" />
                  <span className="gallery-item-caption">
                    {tr(product.collection)} · {tr(product.name)}
                    <span>{t.home.showcase.view}</span>
                  </span>
                </Link>
              ))}
              {isSwipe && (
                <Link className="gallery-item gallery-item-all" to={ROUTES.CATALOGUE}>
                  <span>{t.nav.catalogue}</span>
                  <span className="gallery-item-all-count">
                    {products.length} <span aria-hidden="true">→</span>
                  </span>
                </Link>
              )}
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
