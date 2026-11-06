# DALGA DESIGN — React website

React/Vite implementation of the DALGA DESIGN editorial website.

## Development

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
npm run preview
```

## Contact form

The "Get your piece" drawer (home CTA bar, "Ask about this piece" on product pages) emails the
atelier through [EmailJS](https://www.emailjs.com). The email itself is designed in code —
`src/services/commissionEmail.js` — with the client's details, message and photos of the tagged pieces.

One-time EmailJS setup:

1. **Email Services → Add service** (e.g. Gmail) and connect the inbox that sends the mail.
2. **Email Templates → Create template.** Subject: `{{subject}}`. Content: switch the editor to
   code view and enter only `{{{html}}}` (three braces, so the HTML is not escaped). Set
   **To email** to the inbox that should receive inquiries.
3. Copy the service ID, template ID and **Account → Public key** into `.env.local` (git-ignored):

```bash
VITE_EMAILJS_SERVICE_ID=service_xxx
VITE_EMAILJS_TEMPLATE_ID=template_xxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxx
# Public site address for images and links in the email (defaults to the current origin)
VITE_SITE_URL=https://dalgadesign.com
```

Restart `npm run dev` after changing `.env.local`. Without EmailJS configured, sending falls back to
opening a pre-filled email to the atelier address.

Preview the email design with `npm run email:preview` (writes `dist/email-preview.html`; images load
from the dev server, so keep `npm run dev` running).

## Instagram news

The home "New at the atelier" section shows the four newest posts from
[@dalga.design](https://www.instagram.com/dalga.design/): the latest one featured, the next three as
cards. `npm run instagram` (also run automatically before every `npm run build`) fetches them through
the Instagram API, downloads the images to `public/instagram/` as WebP (via `sharp`) and writes `public/instagram/feed.json`.
The caption's first sentence becomes the title, the rest the excerpt (hashtags and mentions are dropped).
Without a feed the section shows the hand-written entries in `src/data/news.js`.

One-time setup:

1. In the Instagram app, switch @dalga.design to a **Professional** (Business or Creator) account.
2. At [developers.facebook.com](https://developers.facebook.com/apps) create an app with the
   **Instagram** use case ("Instagram API with Instagram Login"). Under **API setup with Instagram
   login → Generate access tokens**, add the account and generate a token.
3. Put it in `.env.local` and in the hosting provider's build environment variables. It has no `VITE_`
   prefix, so it never reaches the browser:

```bash
INSTAGRAM_ACCESS_TOKEN=IGAA...
```

The section updates whenever the site is built, so schedule a daily rebuild (e.g. a deploy hook on a
cron) to keep it current. The token lasts 60 days and every fetch extends it, so regular builds keep it
alive.

## Quality checks

```bash
npm run lint
npm run format:check
```

## Project structure

```
src/
  main.jsx           entry point
  App.jsx            router provider only
  routes/            centralized route config (react-router-dom)
  layouts/           AppLayout: navbar + <Outlet/> + footer, shared across all pages
  pages/              one folder per route; page-only sections live in a local sections/ subfolder
  components/
    ui/               small reusable primitives (Button-like NeedleLink, Reveal, PageHero, EyebrowRow, LineBreaks)
    navigation/       Navbar, NavLinks, mobile menu
    layout/           Footer
    contact/          "Get your piece" contact drawer (provider, drawer + its field/pieces/sent parts, useContactDrawer)
    sections/         sections shared across more than one page (e.g. Statement)
  data/               product catalogue + news content
  services/           commissionRequest: sends the contact form
  constants/          routes, nav items, site info (email/social), asset path helper
  i18n/               Bosnian / English copy and the language provider
  hooks/              useReveal, useMediaQuery, usePhone, useEscapeKey, useFocusTrap, useAtelierNews,
                      usePieceSheet
  utils/              small pure helpers (twoDigits, rafThrottle)
  styles/             global CSS split by section; index.css imports them in cascade order
                      (design tokens at :root in base.css)
```

To add a page: create a folder under `src/pages`, add its route to `src/routes/router.jsx` and, if it
belongs in the navbar, to `src/constants/navigation.js`.

## Images

Images live in `public/images` and are referenced in code with `asset('<path inside images>')`
(from `src/constants/site.js`):

```
public/images/
  brand/              logo figure, Zenka figure, marks/ (the atelier's symbols, drawn as CSS masks)
  ui/                 needle icons for buttons
  home/               hero layers and section backgrounds
  about/              founder portrait (also used on the home page)
  one-of-one/         page hero
  process/            the four process drawings (home filmstrip + One of One page)
  news/               fallback news photos, shown when there is no Instagram feed
  catalogue/          catalogue cover
  textures/           repeating background patterns
  products/<id>/      one folder per product, named after its `id` in src/data/products.js:
                      front, front-close, back, back-close, side, <part>-detail; cover for single-photo pieces
```

To add a product's photos, create `public/images/products/<id>/` and list the files in that product's
`img` / `images` in `src/data/products.js`.

### Image format

Photos are WebP at quality 80; brand marks, the logo, the Zenka figures and the needle icons stay PNG
(they are small, several are drawn as CSS masks, and the logo also appears in the inquiry email). When
adding photos, convert them to WebP first:

- Product, news and catalogue photos: 1200 px on the long side. Home hero layers, process drawings and
  `about/founder.webp`: up to 2000 px. The hero background and cut-out must keep identical dimensions.
- Keep transparency for images that have it (process drawings, hero cut-out).
- `textures/` images repeat as backgrounds; keep them small (under ~200 KB).

`_unused-assets/` (git-ignored, not deployed) holds images and the original OTF fonts that the site no
longer uses, plus the original full-size JPEG/PNG photos (`original-jpegs/`, `original-pngs/`); delete it once nothing there is needed.
