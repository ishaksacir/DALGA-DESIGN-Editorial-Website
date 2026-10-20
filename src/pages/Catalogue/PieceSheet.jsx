import { useEffect, useEffectEvent, useRef, useState } from 'react'

import { useContactDrawer } from '@/components/contact/context'
import { products } from '@/data/products'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { usePieceSheet } from '@/hooks/usePieceSheet'
import { useI18n } from '@/i18n/context'
import { twoDigits } from '@/utils/format'
import { buzz } from '@/utils/haptics'

/** Sideways drag (px) that moves to the neighbouring piece. */
const SWIPE_TO_STEP = 70
/** Downward drag (px), from the top of the sheet, that closes it. */
const PULL_TO_CLOSE = 110
const SPRING =
  'transform 340ms cubic-bezier(0.22, 1, 0.36, 1), opacity 340ms ease, border-radius 340ms ease'

const indexOf = (product) => products.findIndex((p) => p.id === product.id)
const neighbour = (product, dir) =>
  products[(indexOf(product) + dir + products.length) % products.length]
const clothOf = (product) =>
  product.specs.find(([label]) => label.en === 'Fabric')?.[1] ?? product.composition

/**
 * Phone piece sheet. Slides up over the page that opened it (state lives in `?piece=`), swipes
 * sideways to the previous or next piece, and closes by pulling down from the top, the ✕, the
 * scrim or Escape.
 */
export function PieceSheet() {
  const { t, tr } = useI18n()
  const copy = t.phone.piece
  const { product, stepTo, closePiece } = usePieceSheet()
  const { openDrawer } = useContactDrawer()
  const open = !!product
  // Keep the last piece on screen while the sheet slides away.
  const [shown, setShown] = useState(product)
  // The gesture hint fades by itself (CSS) after each opening; stepping hides it at once.
  const [stepped, setStepped] = useState(false)
  const [wasOpen, setWasOpen] = useState(open)
  const sheetRef = useRef(null)
  const innerRef = useRef(null)
  const scrollRef = useRef(null)
  const suppressClick = useRef(false)

  if (product && product !== shown) setShown(product)
  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) setStepped(false)
  }

  useEscapeKey(closePiece, open)

  // Lock the page and focus the sheet while it is open.
  useEffect(() => {
    if (!open) return
    // A class rather than body.style, so it never clobbers the contact drawer's own lock.
    document.documentElement.classList.add('ph-locked')
    sheetRef.current.focus({ preventScroll: true })
    return () => document.documentElement.classList.remove('ph-locked')
  }, [open])

  // Every piece opens at its top.
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }, [product?.id])

  const step = (dir) => {
    const inner = innerRef.current
    if (!shown) return
    buzz()
    setStepped(true)
    inner.style.transition = 'transform 200ms ease-in, opacity 200ms ease-in'
    inner.style.transform = `translateX(${-dir * 100}%)`
    inner.style.opacity = '0'
    setTimeout(() => {
      stepTo(neighbour(shown, dir).id)
      inner.style.transition = 'none'
      inner.style.transform = `translateX(${dir * 40}%)`
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          inner.style.transition = SPRING.replace(/340ms/g, '380ms')
          inner.style.transform = ''
          inner.style.opacity = ''
        }),
      )
    }, 200)
  }

  const close = () => {
    buzz()
    closePiece()
  }

  const onSwipe = useEffectEvent((dir) => step(dir))
  const onPull = useEffectEvent(() => close())

  // Drag gestures: sideways steps between pieces, a pull down from the top closes.
  useEffect(() => {
    const inner = innerRef.current
    let drag = null

    const start = (event) => {
      if (event.target.closest('input, textarea')) return
      suppressClick.current = false
      const point = event.touches[0]
      const top = scrollRef.current?.scrollTop ?? 0
      drag = { x: point.clientX, y: point.clientY, top, mode: null, dx: 0, dy: 0 }
    }
    const move = (event) => {
      if (!drag) return
      const point = event.touches[0]
      const dx = point.clientX - drag.x
      const dy = point.clientY - drag.y
      if (!drag.mode) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return
        drag.mode = Math.abs(dx) > Math.abs(dy) * 1.2 ? 'x' : dy > 0 && drag.top <= 0 ? 'y' : 'none'
        inner.style.transition = 'none'
      }
      if (drag.mode === 'x') {
        event.preventDefault()
        inner.style.transform = `translateX(${dx}px) rotate(${dx / 50}deg)`
        inner.style.opacity = String(1 - Math.min(0.4, Math.abs(dx) / 800))
      } else if (drag.mode === 'y') {
        event.preventDefault()
        const d = Math.max(0, dy * 0.75)
        inner.style.transform = `translateY(${d}px) scale(${1 - Math.min(0.08, d / 3000)})`
        inner.style.borderRadius = `${Math.min(32, d / 5)}px`
      }
      drag.dx = dx
      drag.dy = dy
    }
    const end = () => {
      if (!drag) return
      const { mode, dx, dy } = drag
      drag = null
      // A drag ends with a synthetic click on whatever is under the finger; swallow just that one.
      if (mode === 'x' || mode === 'y') {
        suppressClick.current = true
        setTimeout(() => (suppressClick.current = false), 400)
      }
      inner.style.transition = SPRING
      if (mode === 'x' && Math.abs(dx) > SWIPE_TO_STEP) {
        onSwipe(dx < 0 ? 1 : -1)
      } else if (mode === 'y' && dy > PULL_TO_CLOSE) {
        onPull()
        setTimeout(() => {
          inner.style.transition = 'none'
          inner.style.transform = ''
          inner.style.opacity = ''
          inner.style.borderRadius = ''
        }, 500)
      } else {
        inner.style.transform = ''
        inner.style.opacity = ''
        inner.style.borderRadius = ''
      }
    }
    const swallowClick = (event) => {
      if (!suppressClick.current) return
      suppressClick.current = false
      event.preventDefault()
      event.stopPropagation()
    }

    inner.addEventListener('touchstart', start, { passive: true })
    inner.addEventListener('touchmove', move, { passive: false })
    inner.addEventListener('touchend', end)
    inner.addEventListener('touchcancel', end)
    inner.addEventListener('click', swallowClick, true)
    return () => {
      inner.removeEventListener('touchstart', start)
      inner.removeEventListener('touchmove', move)
      inner.removeEventListener('touchend', end)
      inner.removeEventListener('touchcancel', end)
      inner.removeEventListener('click', swallowClick, true)
    }
  }, [])

  const piece = shown
  const next = piece ? neighbour(piece, 1) : null
  const views = piece ? (piece.images || []).filter((src) => src !== piece.img) : []
  const details = piece
    ? [
        [copy.details.type, tr(piece.category)],
        [copy.details.year, piece.year],
        [copy.details.cloth, tr(clothOf(piece))],
        [copy.details.made, copy.made],
        [copy.details.pattern, copy.pattern],
        [copy.details.timeline, copy.timeline],
      ]
    : []

  const startFromPiece = () => {
    buzz()
    const id = piece.id
    closePiece()
    openDrawer(id)
  }

  return (
    <>
      <div className={`ph-sheet-scrim${open ? ' open' : ''}`} onClick={close} aria-hidden="true" />
      <div
        ref={sheetRef}
        className={`ph-sheet${open ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={piece ? tr(piece.name) : undefined}
        tabIndex={-1}
        inert={!open}
      >
        <div ref={innerRef} className="ph-sheet-inner">
          {piece && (
            <>
              <div ref={scrollRef} className="ph-sheet-scroll">
                <div className="ph-sheet-hero">
                  <img src={piece.img} alt={tr(piece.alt)} />
                  <span className="ph-sheet-grab" aria-hidden="true" />
                  <div className="ph-sheet-controls">
                    <div className="ph-sheet-pill">
                      <button type="button" aria-label={copy.previous} onClick={() => step(-1)}>
                        ‹
                      </button>
                      <span>
                        {twoDigits(indexOf(piece) + 1)} / {twoDigits(products.length)}
                      </span>
                      <button type="button" aria-label={copy.nextPiece} onClick={() => step(1)}>
                        ›
                      </button>
                    </div>
                    <button
                      type="button"
                      className="ph-sheet-close"
                      aria-label={copy.close}
                      onClick={close}
                    >
                      ✕
                    </button>
                  </div>
                  <span className={`ph-sheet-hint${stepped ? ' gone' : ''}`} aria-hidden="true">
                    {copy.hint}
                  </span>
                </div>

                <div className="ph-sheet-intro">
                  <span>{copy.madeOnce(piece.number)}</span>
                  <h2>{tr(piece.name)}</h2>
                  <p>{copy.intro}</p>
                </div>

                <dl className="ph-sheet-details">
                  {details.map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>

                {views.length > 0 && (
                  <div className="ph-sheet-views">
                    {views.map((src, index) => (
                      <img
                        key={src}
                        src={src}
                        alt={copy.view(index + 2, tr(piece.name))}
                        loading="lazy"
                      />
                    ))}
                  </div>
                )}

                <button type="button" className="ph-sheet-next ph-press" onClick={() => step(1)}>
                  <img src={next.img} alt="" loading="lazy" />
                  <span>
                    <span>{copy.next(next.number)}</span>
                    <span>{tr(next.name)}</span>
                  </span>
                  <span aria-hidden="true">→</span>
                </button>
              </div>

              <div className="ph-sheet-foot">
                <button type="button" className="ph-button ph-press" onClick={startFromPiece}>
                  <span>{copy.start}</span>
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
