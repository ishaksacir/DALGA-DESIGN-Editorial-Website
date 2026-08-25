import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { asset } from '@/constants/site'
import { NavLinks } from './NavLinks'
import { MobileMenu } from './MobileMenu'

export function Navbar() {
  const { pathname } = useLocation()
  const isHome = pathname === ROUTES.HOME
  const [menuOpen, setMenuOpen] = useState(false)
  const [openedForPath, setOpenedForPath] = useState(pathname)

  if (pathname !== openedForPath) {
    setOpenedForPath(pathname)
    setMenuOpen(false)
  }

  return (
    <nav className={`nav ${isHome ? 'nav-hero' : 'nav-solid'}`}>
      <Link className="brand" to={ROUTES.HOME}>
        <img src={asset('japod-t.png')} alt="Dalga Design — home" />
      </Link>
      <NavLinks className="nav-links-desktop" />
      <button
        type="button"
        className="nav-toggle"
        aria-expanded={menuOpen}
        aria-controls="mobile-nav-panel"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span />
        <span />
      </button>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </nav>
  )
}
