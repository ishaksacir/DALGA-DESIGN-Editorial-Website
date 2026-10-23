import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { Reveal } from '@/components/ui/Reveal'
import { ROUTES } from '@/constants/routes'
import { usePieceSheet } from '@/hooks/usePieceSheet'
import { useProducts } from '@/hooks/useProducts'
import { useI18n } from '@/i18n/context'
import { buzz } from '@/utils/haptics'
import { twoDigits } from '@/utils/format'

const clothOf = (product) =>
  product.specs.find(([label]) => label.en === 'Fabric')?.[1] ?? product.composition

/** Card width plus the gap between cards: one step of the rail. */
const STEP = 272 + 14
/** How far an image drifts against the scroll, per pixel its card sits off-centre. */
const DRIFT = -0.08

/** "Selected work": a snapping rail of every piece; the card in focus is full size, the rest recede. */
export function PhoneWork() {
  const { t, tr } = useI18n()
  const products = useProducts()
  const { openPiece, pieceHref } = usePieceSheet()
  const [focus, setFocus] = useState(0)
  const railRef = useRef(null)

  const onScroll = () => {
    const rail = railRef.current
    const centre = rail.scrollLeft + rail.clientWidth / 2
    for (const img of rail.querySelectorAll('img')) {
      const card = img.closest('a')
      const offset = card.offsetLeft + card.offsetWidth / 2 - centre
      img.style.transform = `translateX(${offset * DRIFT}px)`
    }
    setFocus(Math.min(products.length - 1, Math.round(rail.scrollLeft / STEP)))
  }

  return (
    <section className="ph-work">
      <Reveal className="ph-section-head">
        <h2>{t.phone.work.title}</h2>
        <span className="ph-count">
          {twoDigits(focus + 1)} / {twoDigits(products.length)}
        </span>
      </Reveal>
      <div ref={railRef} className="ph-rail ph-work-rail" onScroll={onScroll}>
        {products.map((product, index) => (
          <Link
            key={product.id}
            to={pieceHref(product.id)}
            className={`ph-work-card${index === focus ? ' focus' : ''}`}
            onClick={(event) => {
              event.preventDefault()
              buzz()
              openPiece(product.id)
            }}
          >
            <span className="ph-work-media">
              <img
                src={product.img}
                alt={tr(product.alt)}
                loading={index < 3 ? undefined : 'lazy'}
              />
            </span>
            <span className="ph-work-caption">
              <span className="ph-work-meta">
                <span>{tr(product.category)}</span>
                <span>{product.year}</span>
              </span>
              <span className="ph-work-name">{tr(product.name)}</span>
              <span className="ph-work-cloth">
                {tr(clothOf(product))} · {t.product.oneOfOne}
              </span>
            </span>
          </Link>
        ))}
      </div>
      <div className="ph-work-foot">
        <div className="ph-progress">
          <span style={{ width: `${((focus + 1) / products.length) * 100}%` }} />
        </div>
        <Link className="ph-label-link" to={ROUTES.CATALOGUE} onClick={buzz}>
          {t.phone.work.all}
        </Link>
      </div>
    </section>
  )
}
