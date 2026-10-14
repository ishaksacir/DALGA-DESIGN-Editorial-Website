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

The "Get your piece" drawer (home CTA bar, "Ask about this piece" on product pages) posts
`{ name, surname, phone, message, pieces: [{ no, name, note }] }` as JSON to the endpoint in
`VITE_CONTACT_ENDPOINT` (a form service or API route that notifies the atelier):

```bash
# .env
VITE_CONTACT_ENDPOINT=https://example.com/commission
```

Without it, sending falls back to opening a pre-filled email to the atelier address.

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
  hooks/              useReveal, useMediaQuery, useOutsideClick, useScrollToTop, useEscapeKey, useFocusTrap
  utils/              small pure helpers (twoDigits, rafThrottle)
  styles/             global CSS split by section; index.css imports them in cascade order
                      (design tokens at :root in base.css)
```

Static image assets are served from `public/uploads`. To add a page: create a folder under
`src/pages`, add its route to `src/routes/router.jsx` and, if it belongs in the navbar, to
`src/constants/navigation.js`.
