// Renders a sample inquiry email to dist/email-preview.html: `npm run email:preview`.
// Images load from VITE_SITE_URL (defaults to the dev server), so keep `npm run dev` running.
import { mkdirSync, writeFileSync } from 'node:fs'
import process from 'node:process'

import { renderCommissionEmail } from '../src/services/commissionEmail.js'

const siteUrl = process.env.VITE_SITE_URL || 'http://localhost:5173'

const { html } = renderCommissionEmail(
  {
    name: 'Amra',
    surname: 'Hadžić',
    phone: '061 234 567',
    lang: 'bs',
    message:
      'A dress for my sister’s wedding on 20 December. I’m a bridesmaid, so nothing white — I keep thinking of something long and dark green.',
    pieces: [
      {
        no: '05',
        name: 'Darigo asymmetric dress',
        category: 'Dress',
        note: 'This shape, but floor length and in deep green.',
        img: `${siteUrl}/images/products/darigo-dress/front.webp`,
        url: `${siteUrl}/catalogue/darigo-dress`,
      },
      {
        no: '08',
        name: 'Carnival dot coat',
        category: 'Coat',
        note: '',
        img: `${siteUrl}/images/products/carnival-dot-coat/front.webp`,
        url: `${siteUrl}/catalogue/carnival-dot-coat`,
      },
    ],
  },
  { siteUrl },
)

mkdirSync('dist', { recursive: true })
writeFileSync('dist/email-preview.html', html)
console.log('Wrote dist/email-preview.html')
