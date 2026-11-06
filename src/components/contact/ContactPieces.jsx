import { useProducts } from '@/hooks/useProducts'
import { useI18n } from '@/i18n/context'

/** Thumbnail strip for tagging catalogue pieces, with a change note field per tagged piece. */
export function ContactPieces({ tags, tagged, dispatch }) {
  const { t, tr } = useI18n()
  const products = useProducts()
  const copy = t.contact
  const toggleTag = (productId) => dispatch({ type: 'toggleTag', productId })

  return (
    <div className="contact-pieces">
      <div className="contact-pieces-head">
        <span className="contact-label">{copy.tagLabel}</span>
        <span className="contact-optional">{copy.optional}</span>
      </div>
      <div className="contact-strip">
        {products.map((product) => {
          const on = product.id in tags
          return (
            <button
              key={product.id}
              type="button"
              className={`contact-thumb${on ? ' on' : ''}`}
              aria-pressed={on}
              title={tr(product.name)}
              aria-label={`${product.number} ${tr(product.name)}`}
              onClick={() => toggleTag(product.id)}
            >
              <img src={product.img} alt="" loading="lazy" />
              <span>{product.number}</span>
            </button>
          )
        })}
      </div>
      {tagged.map((product) => (
        <div key={product.id} className="contact-tagged">
          <img src={product.img} alt="" />
          <div>
            <div className="contact-tagged-head">
              <span>
                <b>{product.number}</b>
                {tr(product.name)}
              </span>
              <button
                type="button"
                className="contact-text-btn"
                onClick={() => toggleTag(product.id)}
              >
                {copy.remove}
              </button>
            </div>
            <input
              type="text"
              className="contact-note"
              value={tags[product.id]}
              placeholder={copy.notePlaceholder}
              aria-label={copy.noteLabel(tr(product.name))}
              onChange={(event) =>
                dispatch({ type: 'note', productId: product.id, value: event.target.value })
              }
            />
          </div>
        </div>
      ))}
    </div>
  )
}
