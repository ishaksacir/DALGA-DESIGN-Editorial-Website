import { useI18n } from '@/i18n/context'

/** Confirmation shown in place of the form once a request has been sent. */
export function ContactSent({ name, phone, onDone, onAnother }) {
  const { t } = useI18n()
  const copy = t.contact

  return (
    <div className="contact-sent" aria-live="polite">
      <span className="contact-label">{copy.sentLabel}</span>
      <p>{copy.sentText(name, phone)}</p>
      <div className="contact-sent-actions">
        <button type="button" className="contact-primary" onClick={onDone}>
          {copy.done}
        </button>
        <button type="button" className="contact-text-btn" onClick={onAnother}>
          {copy.another}
        </button>
      </div>
    </div>
  )
}
