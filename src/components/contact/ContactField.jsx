/** Labelled underline input for the contact form. Pass `as="textarea"` for multi-line fields. */
export function ContactField({ label, invalid, as: Control = 'input', ...props }) {
  return (
    <label className="contact-field">
      <span className="contact-label">{label}</span>
      <Control
        className={`contact-input${invalid ? ' invalid' : ''}`}
        aria-invalid={invalid}
        {...props}
      />
    </label>
  )
}
