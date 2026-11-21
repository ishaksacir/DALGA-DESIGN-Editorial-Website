# DALGA DESIGN QA agent

Playwright + TypeScript + axe-core audit of the DALGA DESIGN website. It lives in `qa/` with its own `package.json`, so the site's dependencies and scripts are untouched.

## Run

```bash
cd qa
npm ci
npx playwright install chromium
npm run qa            # all 5 viewports, then writes qa-output/qa-report.md (+ .html)
npm run qa:mobile     # 375 + 390 (phone layout)
npm run qa:desktop    # 1440 + 1920
npm run qa:tablet     # 768 (compact nav)
npm run qa:report     # rebuild the report from the last run
npm run qa:html       # Playwright HTML report: screenshots, traces
npm run qa:inventory  # print the test inventory
npm run qa:baseline   # approve current screenshots as visual baselines
```

It uses the site on `http://localhost:5173` (`QA_BASE_URL` to change). If nothing is running there, Playwright starts `npm run dev:site` (Vite only). No Postgres or API server is needed, because the API is mocked.

`npm run qa` first rebuilds `fixtures/products.json` from `src/data/products.js` (the seed catalogue), so the mocked API always serves the current pieces.

## Safety

- `/api/*` is answered by `fixtures/mock-api.ts`. The catalogue comes from the seed file. Admin login always fails, and every write (create, update, delete, upload) is refused and recorded, so nothing touches the database.
- `api.emailjs.com` is intercepted. The "Get your piece" form is tested end to end, including the rendered email, but **no email is ever sent**, even with real EmailJS keys in `.env.local`.
- The admin is only tested up to its login screen. Authentication is never bypassed.
- External hosts (Google Fonts, Instagram, Facebook) are stubbed; links are checked by their `href`, not opened.
- No site source is modified. Output goes to `qa-output/` (git-ignored).

## Layout

| Path                     | What                                                                                                            |
| ------------------------ | --------------------------------------------------------------------------------------------------------------- |
| `inventory/inventory.ts` | Every testable item with ID and priority; tests tag the IDs they cover                                          |
| `fixtures/`              | Mock API, product fixture, runtime monitor, `cover` / `finding` / `unverified` helpers                          |
| `helpers/`               | Page helpers (phone ≤480px / compact ≤800px / desktop), layout inspector, axe wrapper                           |
| `tests/functional`       | Navigation, menus, contact drawer, catalogue, product + phone sheet, home, FAQ, admin, copy, dead-control sweep |
| `tests/responsive`       | Each route at 5 viewports: top/middle/bottom + full-page screenshots, layout checks, Bosnian copy               |
| `tests/a11y`             | axe-core WCAG 2.2 AA per route and with the drawer/sheet open, reduced motion, keyboard and focus trap          |
| `tests/runtime`          | Console errors, failed requests, broken images, every product photo, API-down page                              |
| `tests/visual`           | Screenshot comparison against approved baselines in `baselines/`                                                |
| `triage/`                | Human triage per issue (root cause, fix, verdict), merged into the report                                       |
| `scripts/`               | Fixture builder, report generator, inventory printer                                                            |
