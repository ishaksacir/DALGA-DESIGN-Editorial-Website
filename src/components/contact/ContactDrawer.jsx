import { useCallback, useRef } from 'react'

import { products } from '@/data/products'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { useI18n } from '@/i18n/context'
import { sendCommissionRequest } from '@/services/commissionRequest'

import { ContactField } from './ContactField'
import { ContactPieces } from './ContactPieces'
import { ContactSent } from './ContactSent'

/** Which fields fail. The message is only required when no piece is tagged. */
const validate = (form, tagCount) => ({
  name: !form.name.trim(),
  surname: !form.surname.trim(),
  phone: form.phone.replace(/\D/g, '').length < 7,
  message: !form.message.trim() && tagCount === 0,
})

/** A specific message when only the phone or only the message fails; a generic one otherwise. */
const errorMessage = (errors, status, tried, invalid) => {
  if (status === 'failed') return errors.failed
  if (!tried || !Object.values(invalid).some(Boolean)) return ''
  const only = (field) => Object.entries(invalid).every(([key, bad]) => bad === (key === field))
  if (only('phone')) return errors.phone
  if (only('message')) return errors.message
  return errors.generic
}

/** Right-side "Get your piece" drawer: tag catalogue pieces, leave contact details, send. */
export function ContactDrawer({ state, dispatch, returnFocusRef }) {
  const { t } = useI18n()
  const copy = t.contact
  const panelRef = useRef(null)
  const { open, status, tried, form, tags } = state

  const close = useCallback(() => dispatch({ type: 'close' }), [dispatch])
  useEscapeKey(close, open)
  useFocusTrap(panelRef, open, returnFocusRef)

  const tagged = products.filter((product) => product.id in tags)
  const invalid = validate(form, tagged.length)
  const anyInvalid = Object.values(invalid).some(Boolean)
  const error = errorMessage(copy.errors, status, tried, invalid)

  const fieldProps = (field) => ({
    value: form[field],
    onChange: (event) => dispatch({ type: 'field', field, value: event.target.value }),
    invalid: tried && invalid[field],
  })

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
          <ContactSent
            name={form.name.trim()}
            phone={form.phone.trim()}
            onDone={close}
            onAnother={() => dispatch({ type: 'reset' })}
          />
        ) : (
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="contact-form-body">
              <div className="contact-intro">
                <h3>{copy.heading}</h3>
                <p>{copy.intro}</p>
              </div>

              <ContactPieces tags={tags} tagged={tagged} dispatch={dispatch} />

              <div className="contact-name-row">
                <ContactField
                  label={copy.name}
                  type="text"
                  autoComplete="given-name"
                  {...fieldProps('name')}
                />
                <ContactField
                  label={copy.surname}
                  type="text"
                  autoComplete="family-name"
                  {...fieldProps('surname')}
                />
              </div>
              <ContactField
                label={copy.phone}
                type="tel"
                autoComplete="tel"
                {...fieldProps('phone')}
              />
              <ContactField
                label={copy.message}
                as="textarea"
                rows={4}
                placeholder={copy.messagePlaceholder}
                {...fieldProps('message')}
              />
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
