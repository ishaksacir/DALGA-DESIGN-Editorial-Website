import { SITE } from '@/constants/site'
import { useI18n } from '@/i18n/context'

/** Phone screen shown when a request fails to send. The form is kept, so "Try again" resends it. */
export function ContactFailed({ retrying, onRetry }) {
  const { t } = useI18n()
  const copy = t.phone.failed

  return (
    <div className="contact-failed" role="alert">
      <span className="contact-failed-label">{copy.label}</span>
      <h3>{copy.title}</h3>
      <p>{copy.text}</p>
      <div className="contact-failed-actions">
        <button type="button" className="ph-button" onClick={onRetry} disabled={retrying}>
          <span>{retrying ? copy.retrying : copy.retry}</span>
          <span aria-hidden="true">↻</span>
        </button>
        <a className="ph-button outline" href={`mailto:${SITE.email}`}>
          <span>{copy.email}</span>
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  )
}
