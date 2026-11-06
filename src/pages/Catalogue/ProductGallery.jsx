import { useRef, useState } from 'react'

import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useI18n } from '@/i18n/context'
import { twoDigits } from '@/utils/format'

/** Below this width every image sits in one swipeable row instead of a single framed image. */
const SWIPE_GALLERY = '(max-width: 760px)'

/** Renders the gallery for one product. Mount a fresh instance per product (e.g. `key={product.id}`) so the active image resets on navigation. */
export function ProductGallery({ product }) {
  const { t, tr } = useI18n()
  const images = product.images || [product.img]
  const [active, setActive] = useState(0)
  const isSwipe = useMediaQuery(SWIPE_GALLERY)
  const stripRef = useRef(null)

  // Swiping moves `active`; tapping a thumb scrolls the strip, and the scroll then updates `active`.
  const onSwipe = () => {
    const strip = stripRef.current
    setActive(Math.round(strip.scrollLeft / strip.clientWidth))
  }
  const showImage = (index) => {
    if (!isSwipe) {
      setActive(index)
      return
    }
    const strip = stripRef.current
    strip.scrollTo({ left: index * strip.clientWidth, behavior: 'smooth' })
  }

  return (
    <div className="product-gallery">
      {isSwipe ? (
        <div className="product-swipe">
          <div ref={stripRef} className="product-swipe-strip" onScroll={onSwipe}>
            {images.map((src, index) => (
              <figure key={src}>
                <img
                  src={src}
                  alt={index === 0 ? tr(product.alt) : ''}
                  loading={index === 0 ? undefined : 'lazy'}
                />
              </figure>
            ))}
          </div>
          {images.length > 1 && (
            <>
              <span className="product-swipe-counter" aria-hidden="true">
                {twoDigits(active + 1)} / {twoDigits(images.length)}
              </span>
              <div className="product-swipe-bars" aria-hidden="true">
                {images.map((src, index) => (
                  <span key={src} className={index === active ? 'active' : ''} />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <figure>
          <img src={images[active]} alt={tr(product.alt)} />
        </figure>
      )}
      {images.length > 1 && (
        <div className={`product-thumbs${images.length > 4 ? ' product-thumbs-rows' : ''}`}>
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              className={index === active ? 'active' : ''}
              aria-label={t.product.showImage(index + 1, tr(product.name))}
              aria-current={index === active}
              onClick={() => showImage(index)}
            >
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
