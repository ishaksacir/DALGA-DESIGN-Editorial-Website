import { SITE } from '@/constants/site'

import { renderCommissionEmail } from './commissionEmail'

/**
 * EmailJS sends the rendered inquiry email to the atelier. Set these in `.env.local` (kept out of git);
 * the EmailJS template only needs `{{subject}}` as its subject and `{{{html}}}` as its content.
 */
const EMAILJS = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
}
const EMAILJS_URL = 'https://api.emailjs.com/api/v1.0/email/send'

/** Public site address, so images and links in the email resolve outside the browser. */
const SITE_URL = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '')

const formatPiece = (piece) => `${piece.no} · ${piece.name}${piece.note ? ` — ${piece.note}` : ''}`

/** Plain-text version of the request, used when EmailJS is not configured. */
const toEmailBody = ({ name, surname, phone, message, pieces }) =>
  [
    `${name} ${surname}`,
    phone,
    '',
    ...pieces.map(formatPiece),
    ...(pieces.length ? [''] : []),
    message,
  ].join('\n')

const absolute = (path) => (/^https?:/.test(path) ? path : `${SITE_URL}${path}`)

/**
 * Sends a commission request:
 * `{ name, surname, phone, message, lang, pieces: [{ no, name, category, note, img, path }] }`.
 * Without EmailJS it falls back to a pre-filled email so no enquiry is lost. Rejects on failure.
 */
export async function sendCommissionRequest(payload) {
  if (!EMAILJS.serviceId || !EMAILJS.templateId || !EMAILJS.publicKey) {
    const subject = encodeURIComponent(`Commission request — ${payload.name} ${payload.surname}`)
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${encodeURIComponent(toEmailBody(payload))}`
    return
  }

  const pieces = payload.pieces.map(({ path, img, ...piece }) => ({
    ...piece,
    img: absolute(img),
    url: absolute(path),
  }))
  const { subject, html } = renderCommissionEmail({ ...payload, pieces }, { siteUrl: SITE_URL })

  const response = await fetch(EMAILJS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: EMAILJS.serviceId,
      template_id: EMAILJS.templateId,
      user_id: EMAILJS.publicKey,
      template_params: {
        to_email: SITE.email,
        subject,
        html,
        name: `${payload.name} ${payload.surname}`,
      },
    }),
  })
  if (!response.ok) throw new Error(`Commission request failed with ${response.status}`)
}
