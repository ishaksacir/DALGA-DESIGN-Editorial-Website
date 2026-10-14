import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { asset } from '@/constants/site'
import { useI18n } from '@/i18n/context'
import { NavLinks } from './NavLinks'
import { MobileMenu } from './MobileMenu'
import { LanguageSwitch } from './LanguageSwitch'

export function Navbar() {
  const { pathname } = useLocation()
  const { t } = useI18n()
  // These pages open with a full-bleed header, so the nav floats over it instead of sitting on paper.
  const isOverlay = [ROUTES.HOME, ROUTES.CATALOGUE, ROUTES.ONE_OF_ONE, ROUTES.ABOUT].includes(
    pathname,
  )
  // One of one opens on a dark photograph, so its nav switches to light ink.
  const isLight = pathname === ROUTES.ONE_OF_ONE
  const [menuOpen, setMenuOpen] = useState(false)
  const [openedForPath, setOpenedForPath] = useState(pathname)

  if (pathname !== openedForPath) {
    setOpenedForPath(pathname)
    setMenuOpen(false)
  }

  return (
    <nav className={`nav ${isOverlay ? 'nav-hero' : 'nav-solid'}${isLight ? ' nav-light' : ''}`}>
      <Link className="brand" to={ROUTES.HOME}>
        <img src={asset('japod-t.png')} alt={t.nav.homeAlt} />
      </Link>
      <div className="nav-end">
        <NavLinks className="nav-links-desktop" />
        <LanguageSwitch />
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-panel"
          aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </div>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </nav>
  )
}
