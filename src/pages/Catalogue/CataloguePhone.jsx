import { Link, useSearchParams } from 'react-router-dom'

import { products } from '@/data/products'
import { usePieceSheet } from '@/hooks/usePieceSheet'
import { useI18n } from '@/i18n/context'
import { buzz } from '@/utils/haptics'

const TYPES = ['all', 'dresses', 'skirts', 'tops', 'jackets', 'coats']

/** Garment types each catalogue category counts under (keyed by its English name). A piece can sit under several. */
const TYPES_BY_CATEGORY = {
  'Blouse & skirt': ['tops', 'skirts'],
  'Evening gown': ['dresses'],
  'Jacket & skirt': ['jackets', 'skirts'],
  'Day dress': ['dresses'],
  Dress: ['dresses'],
  'Top & skirt': ['tops', 'skirts'],
  Coat: ['coats'],
  'Top & shorts': ['tops'],
  Jacket: ['jackets'],
}
const typesOf = (product) => TYPES_BY_CATEGORY[product.category.en] || []
const inType = (type) => (product) => type === 'all' || typesOf(product).includes(type)

/** Catalogue on phones: title, a sticky row of type chips, and a two-column grid of every piece. */
export function CataloguePhone() {
  const { t, tr } = useI18n()
  const copy = t.phone.catalogue
  const { openPiece, pieceHref } = usePieceSheet()
  const [params, setParams] = useSearchParams()
  const type = TYPES.includes(params.get('type')) ? params.get('type') : 'all'
  const visible = products.filter(inType(type))

  const pick = (next) => {
    buzz()
    const search = new URLSearchParams(params)
    if (next === 'all') search.delete('type')
    else search.set('type', next)
    setParams(search, { replace: true, preventScrollReset: true })
  }

  return (
    <main className="ph-page ph-catalogue">
      <h1 className="ph-page-title">{copy.title}</h1>
      <p className="ph-page-lead">{copy.lead}</p>
      <div className="ph-chips" role="group" aria-label={copy.filter}>
        {TYPES.map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={type === key}
            className={type === key ? 'on' : ''}
            onClick={() => pick(key)}
          >
            <span>{copy.types[key]}</span>
            <span className="ph-chip-count">{products.filter(inType(key)).length}</span>
          </button>
        ))}
      </div>
      {/* Keyed by type so the cards rise in again whenever the filter changes. */}
      <div key={type} className="ph-grid">
        {visible.map((product) => (
          <Link
            key={product.id}
            to={pieceHref(product.id)}
            className="ph-grid-card"
            onClick={(event) => {
              event.preventDefault()
              buzz()
              openPiece(product.id)
            }}
          >
            <span className="ph-grid-media">
              <img src={product.img} alt={tr(product.alt)} loading="lazy" />
            </span>
            <span className="ph-grid-caption">
              <span>{product.number}</span>
              <span>{tr(product.name)}</span>
            </span>
          </Link>
        ))}
      </div>
    </main>
  )
}
