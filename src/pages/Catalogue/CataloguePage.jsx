import { useMemo, useRef, useState } from 'react'
import { CatalogueCover } from './CatalogueCover'
import { ProductCard } from './ProductCard'
import { NeedleLink } from '@/components/ui/NeedleLink'
import { products } from '@/data/products'
import { useReveal } from '@/hooks/useReveal'
import { useI18n } from '@/i18n/context'

const PAGE_SIZE = 8
const SHOW_MORE_STEP = 4
const ALL = 'all'

/** Filters key on the English category so the active filter survives a language switch. */
const categoryKey = (product) => product.category.en

export function CataloguePage() {
  const { t, tr } = useI18n()
  const [filter, setFilter] = useState(ALL)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const gridRef = useRef(null)
  useReveal([filter, visibleCount], gridRef)

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
  const visible = filtered.slice(0, visibleCount)
  const remaining = filtered.length - visible.length

  const handleFilter = (category) => {
    setFilter(category)
    setVisibleCount(PAGE_SIZE)
  }

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
                  onClick={() => setVisibleCount((count) => count + SHOW_MORE_STEP)}
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
