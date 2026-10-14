import { useEffect, useRef } from 'react'
import { products } from '@/data/products'
import { useI18n } from '@/i18n/context'
import { sendCommissionRequest } from '@/services/commissionRequest'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled])'

/** Which fields fail. The message is only required when no piece is tagged. */
const validate = (form, tagCount) => ({
  name: !form.name.trim(),
  surname: !form.surname.trim(),
  phone: form.phone.replace(/\D/g, '').length < 7,
  message: !form.message.trim() && tagCount === 0,
})

/** Right-side "Get your piece" drawer: tag catalogue pieces, leave contact details, send. */
export function ContactDrawer({ state, dispatch, returnFocusRef }) {
  const { t, tr } = useI18n()
  const copy = t.contact
  const panelRef = useRef(null)
  const { open, status, tried, form, tags } = state

  const close = () => dispatch({ type: 'close' })

  // Lock page scroll, move focus in and trap it while open; give focus back on close.
  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    const returnTo = returnFocusRef.current
    panel.focus()
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        dispatch({ type: 'close' })
        return
      }
      if (event.key !== 'Tab') return
      const items = [...panel.querySelectorAll(FOCUSABLE)]
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (
        event.shiftKey &&
        (document.activeElement === first || document.activeElement === panel)
      ) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
      returnTo?.focus?.()
    }
  }, [open, dispatch, returnFocusRef])

  const tagged = products.filter((product) => product.id in tags)
  const invalid = validate(form, tagged.length)
  const anyInvalid = Object.values(invalid).some(Boolean)
  const lineClass = (field) => (tried && invalid[field] ? ' invalid' : '')

  let error = ''
  if (status === 'failed') error = copy.errors.failed
  else if (tried && anyInvalid) {
    const only = (field) => Object.entries(invalid).every(([key, bad]) => bad === (key === field))
    error = only('phone')
      ? copy.errors.phone
      : only('message')
        ? copy.errors.message
        : copy.errors.generic
  }

  const setField = (field) => (event) =>
    dispatch({ type: 'field', field, value: event.target.value })

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (status === 'sending') return
    if (anyInvalid) {
      dispatch({ type: 'invalid' })
      return
    }
    dispatch({ type: 'status', status: 'sending' })
    try {
      await sendCommissionRequest({
        name: form.name.trim(),
        surname: form.surname.trim(),
        phone: form.phone.trim(),
        message: form.message.trim(),
        pieces: tagged.map((product) => ({
          no: product.number,
          name: product.name.en,
          note: tags[product.id].trim(),
        })),
      })
      dispatch({ type: 'status', status: 'sent' })
    } catch {
      dispatch({ type: 'status', status: 'failed' })
    }
  }

  return (
    <>
      <div className={`contact-scrim${open ? ' open' : ''}`} onClick={close} aria-hidden="true" />
      <aside
        ref={panelRef}
        className={`contact-drawer${open ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={copy.trigger}
        tabIndex={-1}
        inert={!open}
      >
        <div className="contact-drawer-header">
          <span className="contact-drawer-title">{copy.trigger}</span>
          <button type="button" className="contact-drawer-close" onClick={close}>
            {copy.close} ✕
          </button>
        </div>

        {status === 'sent' ? (
          <div className="contact-sent" aria-live="polite">
            <span className="contact-label">{copy.sentLabel}</span>
            <p>{copy.sentText(form.name.trim(), form.phone.trim())}</p>
            <div className="contact-sent-actions">
              <button type="button" className="contact-primary" onClick={close}>
                {copy.done}
              </button>
              <button
                type="button"
                className="contact-text-btn"
                onClick={() => dispatch({ type: 'reset' })}
              >
                {copy.another}
              </button>
            </div>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="contact-form-body">
              <div className="contact-intro">
                <h3>{copy.heading}</h3>
                <p>{copy.intro}</p>
              </div>

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
                        onClick={() => dispatch({ type: 'toggleTag', productId: product.id })}
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
                          onClick={() => dispatch({ type: 'toggleTag', productId: product.id })}
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
                          dispatch({
                            type: 'note',
                            productId: product.id,
                            value: event.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="contact-name-row">
                <label className="contact-field">
                  <span className="contact-label">{copy.name}</span>
                  <input
                    type="text"
                    className={`contact-input${lineClass('name')}`}
                    value={form.name}
                    onChange={setField('name')}
                    autoComplete="given-name"
                    aria-invalid={tried && invalid.name}
                  />
                </label>
                <label className="contact-field">
                  <span className="contact-label">{copy.surname}</span>
                  <input
                    type="text"
                    className={`contact-input${lineClass('surname')}`}
                    value={form.surname}
                    onChange={setField('surname')}
                    autoComplete="family-name"
                    aria-invalid={tried && invalid.surname}
                  />
                </label>
              </div>
              <label className="contact-field">
                <span className="contact-label">{copy.phone}</span>
                <input
                  type="tel"
                  className={`contact-input${lineClass('phone')}`}
                  value={form.phone}
                  onChange={setField('phone')}
                  autoComplete="tel"
                  aria-invalid={tried && invalid.phone}
                />
              </label>
              <label className="contact-field">
                <span className="contact-label">{copy.message}</span>
                <textarea
                  rows={4}
                  className={`contact-input${lineClass('message')}`}
                  value={form.message}
                  onChange={setField('message')}
                  placeholder={copy.messagePlaceholder}
                  aria-invalid={tried && invalid.message}
                />
              </label>
            </div>

            <div className="contact-form-footer">
              <span className="contact-error" role="alert">
                {error}
              </span>
              <button type="submit" className="contact-primary" disabled={status === 'sending'}>
                {status === 'sending' ? copy.sending : copy.submit}
              </button>
            </div>
          </form>
        )}
      </aside>
    </>
  )
}
