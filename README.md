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
    ui/               small reusable primitives (Button-like NeedleLink, Reveal, PageHero, EyebrowRow)
    navigation/       Navbar, NavLinks, mobile menu
    layout/           Footer
    sections/         sections shared across more than one page (e.g. CommissionJourney)
  data/               product catalogue + commission process content
  constants/          routes, nav items, site info (email/social), asset path helper
  hooks/              useReveal, useMediaQuery, usePrefersReducedMotion, useOutsideClick, useScrollToTop
  styles.css          single global stylesheet (design tokens at :root, organized by section)
```

Static image assets are served from `public/uploads`. To add a page: create a folder under
`src/pages`, add its route to `src/routes/router.jsx` and, if it belongs in the navbar, to
`src/constants/navigation.js`.
