import { Link } from 'react-router-dom'
import { Reveal } from '@/components/ui/Reveal'
import { productPath } from '@/constants/routes'
import { useI18n } from '@/i18n/context'

export function ProductCard({ product }) {
  const { tr } = useI18n()

  return (
    <Reveal as="article" className="card">
      <Link to={productPath(product.id)}>
        <div className="card-media">
          <img src={product.img} alt={tr(product.alt)} />
        </div>
        <div className="card-caption">
          <span className="card-number">{product.number}</span>
          <div>
            <h3>{tr(product.name)}</h3>
            <span className="card-category">{tr(product.category)}</span>
          </div>
          <span className="card-year">{product.year}</span>
        </div>
      </Link>
    </Reveal>
  )
}
