import { useState } from 'react'
import { useI18n } from '@/i18n/context'

/** Renders the gallery for one product. Mount a fresh instance per product (e.g. `key={product.id}`) so the active image resets on navigation. */
export function ProductGallery({ product }) {
  const { t, tr } = useI18n()
  const images = product.images || [product.img]
  const [active, setActive] = useState(0)

  return (
    <div className="product-gallery">
      <figure>
        <img src={images[active]} alt={tr(product.alt)} />
      </figure>
      {images.length > 1 && (
        <div className="product-thumbs">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              className={index === active ? 'active' : ''}
              aria-label={t.product.showImage(index + 1, tr(product.name))}
              aria-current={index === active}
              onClick={() => setActive(index)}
            >
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
