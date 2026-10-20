import { useEffect, useMemo, useRef } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import { NeedleLink } from '@/components/ui/NeedleLink'
import { products } from '@/data/products'
import { usePhone } from '@/hooks/usePhone'
import { useReveal } from '@/hooks/useReveal'
import { useI18n } from '@/i18n/context'

import { CatalogueCover } from './CatalogueCover'
import { CataloguePhone } from './CataloguePhone'
import { ProductCard } from './ProductCard'

/** Twelve fills whole rows at every grid width (4, 3, 2 or 1 columns). */
const PAGE_SIZE = 12
const SHOW_MORE_STEP = 12
const ALL = 'all'

/** Filters key on the English category so the active filter survives a language switch. */
const categoryKey = (product) => product.category.en

export function CataloguePage() {
  return usePhone() ? <CataloguePhone /> : <CatalogueIndex />
}

function CatalogueIndex() {
  const { t, tr } = useI18n()
  const location = useLocation()
  const navigate = useNavigate()
  // Filter and count live in the URL, so Back from a product restores the grid exactly.
  const [params, setParams] = useSearchParams()
  const filter = params.get('category') || ALL
  const shown = Number(params.get('show')) || PAGE_SIZE
  const gridRef = useRef(null)

  const categories = useMemo(() => {
    const byKey = new Map(products.map((product) => [categoryKey(product), product.category]))
    return [{ key: ALL }, ...[...byKey].map(([key, label]) => ({ key, label }))]
  }, [])
  const counts = useMemo(() => {
    const map = new Map()
    products.forEach((product) => {
      map.set(categoryKey(product), (map.get(categoryKey(product)) || 0) + 1)
    })
    return map
  }, [])

  const filtered = filter === ALL ? products : products.filter((p) => categoryKey(p) === filter)
  // Arriving with a piece to show (the product page's back link): reveal enough rows to include it.
  const focusId = location.state?.focus
  const focusIndex = focusId ? filtered.findIndex((product) => product.id === focusId) : -1
  const visibleCount = Math.max(shown, Math.ceil((focusIndex + 1) / PAGE_SIZE) * PAGE_SIZE)
  const visible = filtered.slice(0, visibleCount)
  const remaining = filtered.length - visible.length
  useReveal([filter, visibleCount], gridRef)

  const updateParams = (category, count) => {
    const next = new URLSearchParams()
    if (category !== ALL) next.set('category', category)
    if (count > PAGE_SIZE) next.set('show', String(count))
    setParams(next, { replace: true, preventScrollReset: true })
  }
  const handleFilter = (category) => updateParams(category, PAGE_SIZE)

  // Scroll the focused piece into view once, then drop the focus so a later Back to this
  // entry keeps the reader's own scroll position instead of jumping again.
  useEffect(() => {
    if (!focusId) return
    gridRef.current
      ?.querySelector(`[data-product="${focusId}"]`)
      ?.scrollIntoView({ block: 'center', behavior: 'instant' })
    const search = new URLSearchParams(location.search)
    if (visibleCount > PAGE_SIZE) search.set('show', String(visibleCount))
    navigate(
      { search: search.toString() },
      { replace: true, state: null, preventScrollReset: true },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusId])

  return (
    <main className="creations-page">
      <CatalogueCover />
      <section className="catalogue section">
        <div className="catalogue-layout">
          <aside className="catalogue-sidebar">
            <p className="catalogue-sidebar-label">{t.catalogue.filter}</p>
            <ul className="catalogue-filters">
              {categories.map(({ key, label }) => (
                <li key={key}>
                  <button
                    type="button"
                    className={filter === key ? 'active' : ''}
                    onClick={() => handleFilter(key)}
                  >
                    <span>{key === ALL ? t.catalogue.allPieces : tr(label)}</span>
                    <b>{key === ALL ? products.length : counts.get(key)}</b>
                  </button>
                </li>
              ))}
            </ul>
          </aside>
          <div className="catalogue-main">
            <div className="catalogue-grid" ref={gridRef}>
              {visible.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {remaining > 0 && (
              <div className="catalogue-more">
                <NeedleLink
                  className="catalogue-more-btn"
                  onClick={() => updateParams(filter, visibleCount + SHOW_MORE_STEP)}
                >
                  {t.catalogue.showMore(Math.min(remaining, SHOW_MORE_STEP))}
                </NeedleLink>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
