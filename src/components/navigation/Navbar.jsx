import { useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { useContactDrawer } from '@/components/contact/context'
import { NeedleLink } from '@/components/ui/NeedleLink'
import { ROUTES } from '@/constants/routes'
import { asset } from '@/constants/site'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useI18n } from '@/i18n/context'

import { LanguageSwitch } from './LanguageSwitch'
import { MenuToggle } from './MenuToggle'
import { MobileMenu } from './MobileMenu'
import { NavLinks } from './NavLinks'
import { ScrollNavbar } from './ScrollNavbar'

/** Matches the breakpoint in navigation.css where the inline links give way to the menu. */
const COMPACT_NAV = '(max-width: 800px)'

export function Navbar() {
  const { pathname } = useLocation()
  const { t } = useI18n()
  const { openDrawer } = useContactDrawer()
  const isHome = pathname === ROUTES.HOME
  // These pages open with a full-bleed header, so the nav floats over it instead of sitting on paper.
  const isOverlay = [ROUTES.HOME, ROUTES.CATALOGUE, ROUTES.ABOUT].includes(pathname)
  const isCompact = useMediaQuery(COMPACT_NAV)
  const [menuOpen, setMenuOpen] = useState(false)
  const [openedForPath, setOpenedForPath] = useState(pathname)
  const menuTriggerRef = useRef(null)

  if (pathname !== openedForPath) {
    setOpenedForPath(pathname)
    setMenuOpen(false)
  }

  // Widening the window past the breakpoint hides the toggle, so the menu closes with it.
  const showMenu = menuOpen && isCompact

  const openMenu = (event) => {
    menuTriggerRef.current = event.currentTarget
    setMenuOpen(true)
  }
  const closeMenu = () => setMenuOpen(false)
  const getPiece = () => {
    setMenuOpen(false)
    openDrawer()
  }

  return (
    <>
      <nav className={`nav ${isOverlay ? 'nav-hero' : 'nav-solid'}${isHome ? ' nav-home' : ''}`}>
        <Link className="brand" to={ROUTES.HOME}>
          <img src={asset('brand/logo-figure.png')} alt={t.nav.homeAlt} />
        </Link>
        <div className="nav-end">
          <NavLinks className="nav-links-desktop" />
          {isHome && (
            <NeedleLink className="nav-cta" onClick={() => openDrawer()}>
              {t.contact.trigger}
            </NeedleLink>
          )}
          <LanguageSwitch />
          <MenuToggle expanded={showMenu} onClick={openMenu} />
        </div>
      </nav>
      <ScrollNavbar menuOpen={showMenu} onMenuOpen={openMenu} />
      <MobileMenu
        open={showMenu}
        onClose={closeMenu}
        onGetPiece={getPiece}
        returnFocusRef={menuTriggerRef}
      />
    </>
  )
}
