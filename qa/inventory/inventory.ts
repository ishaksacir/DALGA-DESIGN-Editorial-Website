export type Priority = 'Critical' | 'High' | 'Medium' | 'Low'
export type Area = 'functional' | 'responsive' | 'a11y' | 'runtime' | 'visual'

export interface InventoryItem {
  id: string
  title: string
  page: string
  area: Area
  priority: Priority
  source: string
}

export const ROUTES = [
  { id: 'home', path: '/', name: 'Home' },
  { id: 'catalogue', path: '/catalogue', name: 'Catalogue' },
  { id: 'catalogue-filtered', path: '/catalogue?category=Coat', name: 'Catalogue (filtered)' },
  { id: 'product', path: '/catalogue/ink-wrap-top', name: 'Product (gallery)' },
  { id: 'product-single', path: '/catalogue/raw-cotton-set', name: 'Product (single photo)' },
  { id: 'product-missing', path: '/catalogue/no-such-piece', name: 'Product not found' },
  { id: 'one-of-one', path: '/one-of-one', name: 'One of one' },
  { id: 'about', path: '/about', name: 'About' },
  { id: 'not-found', path: '/this-page-does-not-exist', name: '404' },
  { id: 'admin', path: '/admin', name: 'Admin login' },
] as const

const fn = (
  id: string,
  title: string,
  page: string,
  priority: Priority,
  source: string,
): InventoryItem => ({ id, title, page, area: 'functional', priority, source })

export const FUNCTIONAL: InventoryItem[] = [
  fn(
    'NAV-001',
    'Logo returns home from every page',
    'global',
    'High',
    'components/navigation/Navbar.jsx',
  ),
  fn(
    'NAV-002',
    'Desktop nav links route and mark the active page',
    'global',
    'Critical',
    'components/navigation/NavLinks.jsx',
  ),
  fn(
    'NAV-003',
    'Language switch BS/EN: copy, <html lang>, title, persists after reload',
    'global',
    'High',
    'components/navigation/LanguageSwitch.jsx, i18n/LanguageProvider.jsx',
  ),
  fn(
    'NAV-004',
    'Scroll bar slides in when scrolling up past the hero and hides scrolling down',
    'global',
    'Medium',
    'components/navigation/ScrollNavbar.jsx',
  ),
  fn(
    'NAV-005',
    'Compact menu (≤800px): opens, traps focus, Escape, navigates, restores scroll + focus',
    'global',
    'Critical',
    'components/navigation/MobileMenu.jsx',
  ),
  fn(
    'NAV-006',
    'Phone menu (≤480px): opens, navigates, Inquire opens the drawer, closes',
    'global',
    'Critical',
    'components/navigation/PhoneNav.jsx',
  ),
  fn(
    'NAV-007',
    'Direct load, reload and back/forward on every route',
    'global',
    'Critical',
    'routes/router.jsx',
  ),
  fn(
    'NAV-008',
    'Unknown routes show the 404 page with a way home',
    'global',
    'Medium',
    'pages/NotFound/NotFoundPage.jsx',
  ),
  fn(
    'NAV-009',
    'New pages open at the top; Back restores scroll',
    'global',
    'Medium',
    'layouts/AppLayout.jsx (ScrollRestoration)',
  ),
  fn(
    'FTR-001',
    'Footer links route; email + social links have correct targets',
    'global',
    'High',
    'components/layout/Footer.jsx, PhoneFooter.jsx',
  ),
  fn(
    'FTR-002',
    'Footer Back to top scrolls to the top',
    'global',
    'Low',
    'components/layout/Footer.jsx',
  ),
  fn(
    'CON-001',
    'Get your piece drawer opens from every trigger (nav, CTA bar, product, FAQ, scroll bar)',
    'contact',
    'Critical',
    'components/contact/*',
  ),
  fn(
    'CON-002',
    'Drawer: Escape, Close, scrim; focus trapped and returned; scroll locked/restored',
    'contact',
    'High',
    'components/contact/ContactDrawer.jsx, hooks/useFocusTrap.js',
  ),
  fn(
    'CON-003',
    'Validation: empty, whitespace, short phone, message-or-piece rule, error messages',
    'contact',
    'Critical',
    'components/contact/ContactDrawer.jsx',
  ),
  fn(
    'CON-004',
    'Tag pieces, write change notes, remove a tag',
    'contact',
    'High',
    'components/contact/ContactPieces.jsx',
  ),
  fn(
    'CON-005',
    'Valid request sends one (mocked) EmailJS call with the right content',
    'contact',
    'Critical',
    'services/commissionRequest.js, commissionEmail.js',
  ),
  fn(
    'CON-006',
    'Send failure shows an error and keeps the form; retry works',
    'contact',
    'High',
    'components/contact/ContactDrawer.jsx, ContactFailed.jsx',
  ),
  fn(
    'CON-007',
    'Sent screen: Done closes and resets; Send another reopens an empty form',
    'contact',
    'Medium',
    'components/contact/ContactSent.jsx',
  ),
  fn(
    'CON-008',
    'Unsent input is kept when the drawer is closed and reopened',
    'contact',
    'Medium',
    'components/contact/ContactDrawerProvider.jsx',
  ),
  fn(
    'CON-009',
    'Double submit sends only once',
    'contact',
    'High',
    'components/contact/ContactDrawer.jsx',
  ),
  fn(
    'CON-010',
    'Ask about this piece pre-tags that piece',
    'contact',
    'High',
    'pages/Catalogue/ProductPage.jsx',
  ),
  fn(
    'HOME-001',
    'Showcase arrows rotate the four tiles and wrap; tiles link to products',
    'home',
    'High',
    'pages/Home/sections/ShowcaseGallery.jsx',
  ),
  fn(
    'HOME-002',
    'News: pager buttons switch the featured post; links open Instagram in a new tab',
    'home',
    'Medium',
    'pages/Home/sections/AtelierNews.jsx',
  ),
  fn(
    'HOME-003',
    'News rotation pauses for keyboard focus and with reduced motion',
    'home',
    'Medium',
    'pages/Home/sections/AtelierNews.jsx',
  ),
  fn(
    'HOME-004',
    'Process filmstrip steps through the four stages',
    'home',
    'Low',
    'pages/Home/sections/ProcessFilmstrip.jsx',
  ),
  fn(
    'HOME-005',
    'News falls back to news.js when the Instagram feed is missing',
    'home',
    'Medium',
    'hooks/useAtelierNews.js',
  ),
  fn(
    'CAT-001',
    'Catalogue lists 12 pieces, Show more adds the rest; counts match',
    'catalogue',
    'Critical',
    'pages/Catalogue/CataloguePage.jsx',
  ),
  fn(
    'CAT-002',
    'Category filters narrow the grid; state lives in the URL and survives language switch',
    'catalogue',
    'High',
    'pages/Catalogue/CataloguePage.jsx',
  ),
  fn(
    'CAT-003',
    'Bad URL params (?category=bogus, ?show=-5, ?show=abc) are handled',
    'catalogue',
    'Medium',
    'pages/Catalogue/CataloguePage.jsx',
  ),
  fn(
    'CAT-004',
    'Card → product → Back restores filter, count and scroll',
    'catalogue',
    'High',
    'pages/Catalogue/ProductPage.jsx',
  ),
  fn(
    'CAT-005',
    'Product back link from a direct visit opens the catalogue scrolled to that piece',
    'catalogue',
    'Medium',
    'pages/Catalogue/CataloguePage.jsx',
  ),
  fn(
    'CAT-006',
    'Phone catalogue: type chips filter; every piece is reachable under a type',
    'catalogue',
    'High',
    'pages/Catalogue/CataloguePhone.jsx',
  ),
  fn(
    'PRD-001',
    'Product page shows name, specs, composition, care in the active language',
    'product',
    'Critical',
    'pages/Catalogue/ProductPage.jsx',
  ),
  fn(
    'PRD-002',
    'Gallery thumbnails switch the image (desktop) / scroll the strip (≤760px)',
    'product',
    'High',
    'pages/Catalogue/ProductGallery.jsx',
  ),
  fn(
    'PRD-003',
    'Unknown product shows not-found with a link back',
    'product',
    'High',
    'pages/Catalogue/ProductPage.jsx',
  ),
  fn(
    'PRD-004',
    'Every piece in the catalogue has a working product page and loadable photos',
    'product',
    'High',
    'fixtures/products.json',
  ),
  fn(
    'SHT-001',
    'Phone piece sheet: opens from grid, prev/next wrap, close (✕, scrim, Escape, Back)',
    'catalogue',
    'Critical',
    'pages/Catalogue/PieceSheet.jsx, hooks/usePieceSheet.js',
  ),
  fn(
    'SHT-002',
    'Phone: /catalogue/:id redirects to the sheet; ?piece= deep link opens it',
    'catalogue',
    'High',
    'pages/Catalogue/ProductPage.jsx',
  ),
  fn(
    'SHT-003',
    'Phone sheet: Start from this piece opens the drawer with the piece tagged',
    'catalogue',
    'High',
    'pages/Catalogue/PieceSheet.jsx',
  ),
  fn(
    'OOO-001',
    'One of one FAQ: one answer open at a time; closed answers unreachable',
    'one-of-one',
    'Medium',
    'pages/OneOfOne/sections/Faq.jsx',
  ),
  fn('ABT-001', 'About page content and links', 'about', 'Low', 'pages/About/*'),
  fn(
    'ADM-001',
    'Admin login: empty disabled, wrong password + lockout errors shown, no access without login',
    'admin',
    'High',
    'pages/Admin/AdminLogin.jsx',
  ),
  fn(
    'ERR-001',
    'Catalogue API down → load-error page with working retry',
    'global',
    'Critical',
    'pages/LoadError/LoadErrorPage.jsx',
  ),
  fn(
    'I18N-001',
    'Bosnian is the default and every page renders without English leftovers',
    'global',
    'High',
    'i18n/locales',
  ),
  fn('I18N-002', 'Copy consistency between related messages', 'global', 'Low', 'i18n/locales'),
  fn(
    'KBD-001',
    'Keyboard: Tab order reaches nav and drawer controls with visible focus',
    'global',
    'High',
    'global',
  ),
  fn('KBD-002', 'Detect elements that look interactive but do nothing', 'global', 'High', 'global'),
]

export const VIEWPORTS = [
  { id: 'mobile-375', width: 375, height: 812 },
  { id: 'mobile-390', width: 390, height: 844 },
  { id: 'tablet-768', width: 768, height: 1024 },
  { id: 'desktop-1440', width: 1440, height: 900 },
  { id: 'desktop-1920', width: 1920, height: 1080 },
] as const

export const perRoute: InventoryItem[] = ROUTES.flatMap((r) => [
  {
    id: `RESP-${r.id}`,
    title: 'Layout at 5 viewports (overflow, overlap, clipping, top/mid/bottom)',
    page: r.id,
    area: 'responsive' as const,
    priority: 'High' as const,
    source: r.path,
  },
  {
    id: `BS-${r.id}`,
    title: 'Bosnian (default) layout renders without overflow',
    page: r.id,
    area: 'visual' as const,
    priority: 'Medium' as const,
    source: r.path,
  },
  {
    id: `A11Y-${r.id}`,
    title: 'axe-core WCAG 2.2 AA scan',
    page: r.id,
    area: 'a11y' as const,
    priority: 'High' as const,
    source: r.path,
  },
  {
    id: `RT-${r.id}`,
    title: 'No console errors, failed requests or broken images',
    page: r.id,
    area: 'runtime' as const,
    priority: 'High' as const,
    source: r.path,
  },
])

export const EXTRA: InventoryItem[] = [
  {
    id: 'A11Y-RM',
    title: 'Reduced motion: content visible, no auto-rotation',
    page: 'global',
    area: 'a11y',
    priority: 'Medium',
    source: 'styles/reduced-motion.css',
  },
  {
    id: 'A11Y-DIALOG',
    title: 'Drawer, menus and piece sheet expose dialog role, name and named buttons',
    page: 'global',
    area: 'a11y',
    priority: 'High',
    source: 'global',
  },
  {
    id: 'VIS-BASE',
    title: 'Screenshot comparison with approved baselines',
    page: 'global',
    area: 'visual',
    priority: 'Low',
    source: 'global',
  },
]

export const INVENTORY: InventoryItem[] = [...FUNCTIONAL, ...perRoute, ...EXTRA]
export const byId = new Map(INVENTORY.map((i) => [i.id, i]))
