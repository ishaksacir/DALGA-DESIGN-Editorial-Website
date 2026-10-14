import { SITE } from '@/constants/site'

/** Form service or API route that notifies the atelier. Set `VITE_CONTACT_ENDPOINT` in `.env`. */
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT

/** Plain-text version of the request, used when no endpoint is configured. */
const toEmailBody = ({ name, surname, phone, message, pieces }) =>
  [
    `${name} ${surname}`,
    phone,
    '',
    ...pieces.map((piece) => `${piece.no} · ${piece.name}${piece.note ? ` — ${piece.note}` : ''}`),
    ...(pieces.length ? [''] : []),
    message,
  ].join('\n')

/**
 * Sends a commission request: `{ name, surname, phone, message, pieces: [{ no, name, note }] }`.
 * Without an endpoint it falls back to a pre-filled email so no enquiry is lost. Rejects on failure.
 */
export async function sendCommissionRequest(payload) {
  if (!ENDPOINT) {
    const subject = encodeURIComponent(`Commission request — ${payload.name} ${payload.surname}`)
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${encodeURIComponent(toEmailBody(payload))}`
    return
  }

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw new Error(`Commission request failed with ${response.status}`)
}
