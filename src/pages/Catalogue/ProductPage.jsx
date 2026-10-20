import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'

import { useContactDrawer } from '@/components/contact/context'
import { NeedleLink } from '@/components/ui/NeedleLink'
import { ROUTES } from '@/constants/routes'
import { getProductById } from '@/data/products'
import { usePhone } from '@/hooks/usePhone'
import { useI18n } from '@/i18n/context'

import { ProductGallery } from './ProductGallery'

export function ProductPage() {
  const { productId } = useParams()
  // Phones show pieces in a sheet over the catalogue, so a direct link opens it there.
  if (usePhone() && getProductById(productId)) {
    return <Navigate to={`${ROUTES.CATALOGUE}?piece=${productId}`} replace />
  }
  return <ProductDetail productId={productId} />
}

function ProductDetail({ productId }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { t, tr } = useI18n()
  const copy = t.product
  const { openDrawer } = useContactDrawer()
  const product = getProductById(productId)

  if (!product) {
    return (
      <main className="creations-page">
        <section className="page-hero compact creations-hero">
          <p>{copy.notFoundEyebrow}</p>
          <h1>{copy.notFoundTitle}</h1>
        </section>
        <section className="section">
          <p className="lead">
            {copy.notFoundText} <Link to={ROUTES.CATALOGUE}>{copy.notFoundLink}</Link>
          </p>
        </section>
      </main>
    )
  }

  return (
    <main className="creations-page">
      <section className="product section">
        {/* From the catalogue this is a plain Back, so the filter, count and scroll come back as
            they were; arriving any other way, the catalogue opens scrolled to this piece. */}
        <Link
          className="text-link"
          to={ROUTES.CATALOGUE}
          state={{ focus: product.id }}
          onClick={(event) => {
            if (!location.state?.fromCatalogue) return
            event.preventDefault()
            navigate(-1)
          }}
        >
          {copy.back}
        </Link>
        <div className="product-grid">
          <ProductGallery key={product.id} product={product} />
          <div className="product-info">
            <p className="kicker">
              {tr(product.collection)} · {product.year}
            </p>
            <h1>{tr(product.name)}</h1>
            <p className="category">{tr(product.category)}</p>
            <p className="lead italic">{tr(product.intro)}</p>
            <p className="product-description">{tr(product.description)}</p>
            <dl className="product-specs">
              {product.specs.map(([label, value]) => (
                <div key={label.en}>
                  <dt>{tr(label)}</dt>
                  <dd>{tr(value)}</dd>
                </div>
              ))}
              <div>
                <dt>{copy.composition}</dt>
                <dd>{tr(product.composition)}</dd>
              </div>
              <div>
                <dt>{copy.piece}</dt>
                <dd>
                  {product.number} · {copy.oneOfOne}
                </dd>
              </div>
            </dl>
            {product.care && (
              <div className="product-care">
                <h2>{copy.care}</h2>
                <ul>
                  {product.care.map((line) => (
                    <li key={line.en}>{tr(line)}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="product-cta">
              <NeedleLink onClick={() => openDrawer(product.id)}>{t.contact.askAbout}</NeedleLink>
              <p className="product-cta-note">{copy.ctaNote}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
