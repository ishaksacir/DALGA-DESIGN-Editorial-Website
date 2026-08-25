import { Link, useNavigate, useParams } from 'react-router-dom'
import { Reveal } from '@/components/ui/Reveal'
import { NeedleLink } from '@/components/ui/NeedleLink'
import { ProductGallery } from './ProductGallery'
import { getAdjacentProducts, getProductById } from '@/data/products'
import { productPath, ROUTES } from '@/constants/routes'
import { SITE } from '@/constants/site'

export function ProductPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const product = getProductById(productId)

  if (!product) {
    return (
      <main className="creations-page">
        <section className="page-hero compact creations-hero">
          <p>Catalogue</p>
          <h1>Piece not found</h1>
        </section>
        <section className="section">
          <p className="lead">
            That commission isn’t in the archive.{' '}
            <Link to={ROUTES.CATALOGUE}>Return to the catalogue →</Link>
          </p>
        </section>
      </main>
    )
  }

  const { prev, next } = getAdjacentProducts(product)

  return (
    <main className="creations-page">
      <section className="product section">
        <Link className="text-link" to={ROUTES.CATALOGUE}>
          ← Catalogue
        </Link>
        <div className="product-grid">
          <ProductGallery key={product.id} product={product} />
          <div>
            <p className="kicker">
              {product.collection} · {product.year}
            </p>
            <h1>{product.name}</h1>
            <p className="category">{product.category}</p>
            <p className="lead italic">{product.intro}</p>
            <p>{product.description}</p>
            <NeedleLink href={`mailto:${SITE.email}`}>Begin a conversation</NeedleLink>
          </div>
        </div>
      </section>
      <section className="making">
        <Reveal>
          <p className="kicker">How it was made</p>
          <h2>In the making</h2>
          <p>{product.creation}</p>
        </Reveal>
        <Reveal>
          <dl>
            {product.specs.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
            <div>
              <dt>Composition</dt>
              <dd>{product.composition}</dd>
            </div>
            <div>
              <dt>Piece</dt>
              <dd>{product.number} · One of one</dd>
            </div>
          </dl>
        </Reveal>
      </section>
      <div className="product-nav section">
        <button type="button" onClick={() => navigate(productPath(prev.id))}>
          ← {prev.name}
        </button>
        <button type="button" onClick={() => navigate(productPath(next.id))}>
          {next.name} →
        </button>
      </div>
    </main>
  )
}
