import { useMemo, useRef, useState } from 'react'
import { PageHero } from '@/components/ui/PageHero'
import { EyebrowRow } from '@/components/ui/EyebrowRow'
import { ProductCard } from './ProductCard'
import { products } from '@/data/products'
import { useReveal } from '@/hooks/useReveal'

export function CataloguePage() {
  const [filter, setFilter] = useState('All')
  const gridRef = useRef(null)
  useReveal([filter], gridRef)

  const categories = useMemo(
    () => ['All', ...new Set(products.map((product) => product.category))],
    [],
  )
  const filtered = filter === 'All' ? products : products.filter((p) => p.category === filter)

  return (
    <main className="creations-page">
      <PageHero className="creations-hero" eyebrow="Archive · 2024—2026" title="Catalogue" />
      <section className="catalogue section">
        <EyebrowRow
          start="All pieces"
          end={`${filtered.length} of ${products.length} commissions · Never repeated`}
        />
        <div className="catalogue-filters">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={filter === category ? 'active' : ''}
              onClick={() => setFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="catalogue-grid" ref={gridRef}>
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  )
}
