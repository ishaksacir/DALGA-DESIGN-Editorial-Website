/**
 * Builds the atelier's "new inquiry" email from a commission request.
 * Email clients ignore stylesheets and most layout CSS, so this is table-based with inline styles.
 * Kept free of app imports so it can be rendered outside Vite (see `scripts/preview-email.js`).
 */

const C = {
  page: '#efebe5',
  card: '#fbfaf7',
  ink: '#17140f',
  body: '#2b2620',
  muted: '#6b5f4d',
  accent: '#6f5b46',
  rule: '#e3ddd3',
  panel: '#f3efe8',
  badge: '#ece4d6',
}
const SANS = "Manrope, 'Helvetica Neue', Helvetica, Arial, sans-serif"
const SERIF = "Gloock, Georgia, 'Times New Roman', serif"
const LANGUAGE_NAMES = { bs: 'Bosnian', en: 'English' }

const escape = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

/** Escapes user text and keeps their line breaks. */
const paragraphs = (value) => escape(value).replace(/\r?\n/g, '<br>')

/** wa.me wants the number in international form, digits only. Local numbers are assumed Bosnian (+387). */
const whatsappNumber = (phone) => {
  const digits = phone.replace(/\D/g, '')
  if (phone.trim().startsWith('+')) return digits
  if (digits.startsWith('00')) return digits.slice(2)
  if (digits.startsWith('0')) return `387${digits.slice(1)}`
  return digits
}

const formatDate = (date) =>
  new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Sarajevo',
  })
    .format(date)
    .replace(' at ', ', ')

const label = (text) =>
  `<p style="margin:0 0 12px;font-family:${SANS};font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${C.accent};">${text}</p>`

const button = (href, text, solid) =>
  `<a href="${escape(href)}" style="display:inline-block;padding:13px 22px;font-family:${SANS};font-size:13px;font-weight:700;text-decoration:none;border:1px solid ${C.ink};background:${solid ? C.ink : C.card};color:${solid ? C.card : C.ink};">${text}</a>`

const pieceCard = (piece) => `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${C.rule};background:${C.card};margin:0 0 12px;">
    <tr>
      <td class="thumb" width="132" valign="top" style="width:132px;background:${C.panel};">
        <a href="${escape(piece.url)}"><img src="${escape(piece.img)}" width="132" alt="${escape(piece.name)}" style="display:block;width:132px;height:auto;border:0;"></a>
      </td>
      <td valign="top" style="padding:18px 20px;font-family:${SANS};">
        <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:1px;color:${C.accent};">№ ${escape(piece.no)}${piece.category ? ` &nbsp;·&nbsp; ${escape(piece.category)}` : ''}</p>
        <p style="margin:0 0 12px;font-family:${SERIF};font-size:20px;line-height:1.25;color:${C.ink};">
          <a href="${escape(piece.url)}" style="color:${C.ink};text-decoration:none;">${escape(piece.name)}</a>
        </p>
        ${
          piece.note
            ? `<p style="margin:0;font-size:15px;line-height:1.55;color:${C.body};"><span style="color:${C.accent};font-weight:700;">Client's note:</span> ${paragraphs(piece.note)}</p>`
            : `<p style="margin:0;font-size:14px;line-height:1.55;color:${C.muted};font-style:italic;">No note added.</p>`
        }
      </td>
    </tr>
  </table>`

/**
 * `request`: `{ name, surname, phone, message, lang, pieces: [{ no, name, category, note, img, url }] }`
 * with absolute `img` / `url`. Returns `{ subject, html }`.
 */
export function renderCommissionEmail(request, { siteUrl, sentAt = new Date() }) {
  const { name, surname, phone, message, lang, pieces } = request
  const fullName = `${name} ${surname}`
  const subject = `New inquiry — ${fullName}${pieces.length ? ` · ${pieces.length} piece${pieces.length > 1 ? 's' : ''}` : ''}`
  const siteHost = siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')
  const pad = 'padding-left:40px;padding-right:40px;'

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escape(subject)}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Gloock&family=Manrope:wght@400;700&display=swap');
  @media (max-width: 620px) {
    .px { padding-left: 22px !important; padding-right: 22px !important; }
    .name { font-size: 30px !important; }
    .thumb, .thumb img { width: 104px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.page};-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;overflow:hidden;">${escape(phone)}${message ? ` — ${escape(message.slice(0, 90))}` : ''}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.page};">
<tr><td align="center" style="padding:28px 12px;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:${C.card};">

    <tr><td class="px" style="${pad}padding-top:28px;padding-bottom:24px;border-bottom:1px solid ${C.rule};">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td valign="middle"><img src="${escape(siteUrl)}/images/brand/logo-figure.png" height="40" alt="Dalga Design" style="display:block;height:40px;width:auto;border:0;"></td>
        <td align="right" valign="middle"><span style="display:inline-block;padding:7px 12px;background:${C.badge};font-family:${SANS};font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${C.accent};">New inquiry</span></td>
      </tr></table>
    </td></tr>

    <tr><td class="px" style="${pad}padding-top:32px;font-family:${SANS};">
      <p style="margin:0 0 10px;font-size:13px;color:${C.muted};">${escape(formatDate(sentAt))}${LANGUAGE_NAMES[lang] ? ` &nbsp;·&nbsp; Wrote in ${LANGUAGE_NAMES[lang]}` : ''}</p>
      <h1 class="name" style="margin:0 0 24px;font-family:${SERIF};font-size:36px;font-weight:400;line-height:1.15;color:${C.ink};">${escape(fullName)}</h1>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${C.rule};border-bottom:1px solid ${C.rule};"><tr>
        <td width="90" style="padding:16px 0;font-size:13px;color:${C.muted};">Phone</td>
        <td style="padding:16px 0;font-size:18px;font-weight:700;color:${C.ink};"><a href="tel:${escape(phone.replace(/[^\d+]/g, ''))}" style="color:${C.ink};text-decoration:none;">${escape(phone)}</a></td>
      </tr></table>
      <p style="margin:20px 0 0;">
        ${button(`tel:${phone.replace(/[^\d+]/g, '')}`, `Call ${escape(name)}`, true)}&nbsp;
        ${button(`https://wa.me/${whatsappNumber(phone)}`, 'WhatsApp', false)}
      </p>
    </td></tr>

    ${
      message
        ? `<tr><td class="px" style="${pad}padding-top:36px;">
      ${label('Message')}
      <div style="padding:22px 24px;background:${C.panel};border-left:3px solid ${C.accent};font-family:${SANS};font-size:16px;line-height:1.7;color:${C.body};">${paragraphs(message)}</div>
    </td></tr>`
        : ''
    }

    ${
      pieces.length
        ? `<tr><td class="px" style="${pad}padding-top:36px;">
      ${label(`Selected pieces (${pieces.length})`)}
      ${pieces.map(pieceCard).join('')}
    </td></tr>`
        : ''
    }

    <tr><td class="px" style="${pad}padding-top:28px;padding-bottom:28px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${C.rule};"><tr>
        <td style="padding-top:24px;font-family:${SANS};font-size:15px;line-height:1.6;color:${C.body};">Please reply within <strong style="color:${C.ink};">2 working days</strong> — the client was promised an answer by then.</td>
      </tr></table>
    </td></tr>

  </table>
  <p style="margin:18px 0 0;max-width:600px;font-family:${SANS};font-size:12px;line-height:1.6;color:${C.muted};">
    Sent automatically from the “Get your piece” form on <a href="${escape(siteUrl)}" style="color:${C.muted};">${escape(siteHost)}</a>.
  </p>
</td></tr>
</table>
</body>
</html>`

  return { subject, html }
}
