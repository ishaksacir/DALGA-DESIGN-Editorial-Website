# DALGA DESIGN website: bug-fix brief

A QA audit (Playwright + axe-core, 5 viewports, English and Bosnian) found the issues below. Each one reproduced on three full runs plus retries, and every root cause was checked against the source. There are no critical or high-severity issues. Fix them in order, and after each fix run the test listed under **Verify**.

## Ground rules

- Keep the existing structure and conventions in `README.md` (`src/styles/*` split by section, design tokens at `:root` in `base.css`, copy in `src/i18n/locales/en.js` **and** `bs.js`).
- Don't touch `qa/`, `server/` or the data files unless a fix below says so.
- When done, `npm run lint` and `npm run format:check` must pass. `format:check` already fails on `index.html` and `src/components/navigation/PhoneNav.jsx` before any of these fixes; run `npx prettier --write` on those two files.
- Run the QA suite with:
  ```bash
  cd qa && npm ci && npx playwright install chromium
  npx playwright test <spec> -g "<test name>"
  npm run qa   # everything, writes qa/qa-output/qa-report.md
  ```
  It mocks the API and EmailJS, so it never touches the database or sends email.

---

## MEDIUM

### 1. Phone piece sheet lets keyboard focus escape

- **Where:** `src/pages/Catalogue/PieceSheet.jsx`. The sheet is `role="dialog" aria-modal="true"`, but it only calls `sheetRef.current.focus()` on open.
- **Bug:** at ≤480px, with the sheet open, Tab moves to the page behind the full-screen sheet (first the header logo).
- **Fix:** use `useFocusTrap(sheetRef, open, returnFocusRef)` (from `src/hooks/useFocusTrap.js`), the way `ContactDrawer` and `MobileMenu` do. Store the grid card that opened the sheet so focus returns to it on close.
  - `useFocusTrap` also sets `body.style.overflow`. The sheet already locks scroll with the `ph-locked` class on `<html>` so that it doesn't clobber the drawer's lock. Make sure handing over from sheet to drawer ("Start from this piece") still leaves the page unlocked after both close. Add an option to `useFocusTrap` to skip the overflow lock if needed.
- **Verify:** `tests/a11y/a11y.spec.ts` → "axe: contact drawer open @any" (project `mobile-390`); `tests/functional/product.spec.ts` (all three phone sheet tests).

### 2. Phone catalogue hides "Shirt & trousers" from every type filter

- **Where:** `src/pages/Catalogue/CataloguePhone.jsx`. `TYPES_BY_CATEGORY` has no `'Shirt & trousers'` entry, and there's no fallback.
- **Bug:** piece #20 "Camel wrap shirt, wide trousers" only appears under "All" on phones. Any category added later in the admin will vanish the same way.
- **Fix:** add `'Shirt & trousers': ['tops']`, or add a `trousers` type with copy in both locales (`phone.catalogue.types`). Also give unmapped categories a fallback so admin-created pieces always land under some chip.
- **Verify:** `tests/functional/catalogue.spec.ts` → "type chips filter; every piece is reachable under a type" (`mobile-375`, `mobile-390`).

### 3. Grey text below WCAG contrast (4.5:1)

These are hard-coded greys on the paper background (`#f5f3ef` / `#f7f5f1`), all 10–12px:

| Element                                       | Where                                                        | Colour    | Ratio |
| --------------------------------------------- | ------------------------------------------------------------ | --------- | ----- |
| Inactive language button                      | `navigation.css:73`, `.lang-switch button { opacity: 0.45 }` | ≈ #92908b | 2.92  |
| Product spec labels `dt`, `.product-cta-note` | `product.css:102`, `:180`                                    | #8c8375   | 3.37  |
| Product `.category`                           | `shared.css:61`                                              | #8a7f6c   | 3.55  |
| Drawer "Optional" (`.contact-optional`)       | `contact-drawer.css:164` (also `:292`)                       | #8a8178   | 3.51  |
| Catalogue `.card-category`                    | `catalogue.css:143`                                          | #7d7364   | 4.2   |

- **Fix:** use `var(--muted)` (#6b5f4d, passes) or a new token that reaches 4.5:1. Check the same grey in `home-process.css:217` and `--ph-quiet` (`phone.css:16`) where it sits on light backgrounds. For the language switch, raise the inactive opacity (~0.7) or use a colour instead of opacity.
- **Keep the look:** it should stay quiet and editorial, just readable.
- **Verify:** `tests/a11y/a11y.spec.ts` → every "axe <page>" test; `tests/functional/menus.spec.ts` (compact menu axe check, `tablet-768`).

### 4. Home news carousel ignores reduced motion

- **Where:** `src/pages/Home/sections/AtelierNews.jsx`: `const rotating = count > 1 && !paused`.
- **Bug:** with `prefers-reduced-motion: reduce`, the featured post still switches every 7s (`ROTATE_MS`). Rotation only pauses for keyboard focus; there's no pause for mouse or touch users (WCAG 2.2.2).
- **Fix:** `const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')` (the hook already exists) and `rotating = count > 1 && !paused && !reduceMotion`. Optionally also pause on pointer hover over the section.
- **Verify:** `tests/a11y/a11y.spec.ts` → "reduced motion: content visible and news does not auto-rotate".

---

## LOW

### 5. Catalogue URL params can empty the grid

- **Where:** `src/pages/Catalogue/CataloguePage.jsx`.
- **Bugs:**
  - `/catalogue?show=-5` shows no cards and a "Show 12 more" button. Line 33, `Number(params.get('show')) || PAGE_SIZE`, lets negative numbers through.
  - `/catalogue?category=Nonexistent` (for example, an old link after a category rename) shows an empty grid with no filter highlighted.
- **Fix:** `const shown = Math.max(PAGE_SIZE, Number(params.get('show')) || 0)`, and treat a `category` that isn't in `categories` as `ALL`.
- **Verify:** `tests/functional/catalogue.spec.ts` → "bad URL params are handled".

### 6. Reply time is promised two different ways

- **Where:** `src/i18n/locales/en.js` and `bs.js`. `product.ctaNote` says "We answer every letter personally, **within a week**." `contact.intro` says "We reply **within two working days**." The Bosnian copy has the same contradiction.
- **Fix:** pick one reply time and use it in both strings, in both languages. Ask the owner which one is true if it's unclear.
- **Verify:** `tests/functional/pages.spec.ts` → "copy: related messages agree".

---

## Not bugs (don't change)

- The phone filter chips are sticky and cover cards while scrolling, by design.
- The phone piece sheet is full-screen, so its scrim can't be tapped. It closes with ✕, Escape, Back or pull-down, which all work.
- The admin is English-only and outside the site layout, by design.

## Done when

- `cd qa && npm run qa` ends with **0 failed**.
- `npm run lint` and `npm run format:check` pass.
- A visual check in both languages at 390px and 1440px still looks right.
