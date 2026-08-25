import { Link } from 'react-router-dom'
import { Reveal } from '@/components/ui/Reveal'
import { productPath } from '@/constants/routes'

export function ProductCard({ product }) {
  return (
    <Reveal as="article" className="card">
      <Link to={productPath(product.id)}>
        <div>
          <img src={product.img} alt={product.alt} />
          <b>{product.number}</b>
        </div>
        <p>
          {product.collection} · {product.year}
        </p>
        <h3>{product.name}</h3>
        <span>{product.category}</span>
      </Link>
    </Reveal>
  )
}
