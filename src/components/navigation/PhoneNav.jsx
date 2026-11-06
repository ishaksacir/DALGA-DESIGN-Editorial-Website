import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { useContactDrawer } from '@/components/contact/context'
import { ROUTES } from '@/constants/routes'
import { asset, SITE } from '@/constants/site'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { usePieceSheet } from '@/hooks/usePieceSheet'
import { useI18n } from '@/i18n/context'
import { buzz } from '@/utils/haptics'
import { rafThrottle } from '@/utils/rafThrottle'

import { LanguageSwitch } from './LanguageSwitch'

/** Share of the viewport the home hero must scroll past before the header turns solid. */
const HERO_PASSED = 0.9

const MENU_ITEMS = [
  { key: 'home', to: ROUTES.HOME },
  { key: 'catalogue', to: ROUTES.CATALOGUE },
  { key: 'process', to: ROUTES.ONE_OF_ONE },
  { key: 'about', to: ROUTES.ABOUT },
  { key: 'inquire' },
]

const isActive = (pathname, to) =>
  to === ROUTES.HOME ? pathname === to : !!to && pathname.startsWith(to)

/**
 * Phone header, menu button and full-screen menu. The header sits transparent over the home
 * hero and turns into a blurred paper bar once it is passed;
 * on every other page it starts solid.
 */
export function PhoneNav() {
  const { pathname } = useLocation()
  const { t } = useI18n()
  const copy = t.phone.nav
  const { openDrawer } = useContactDrawer()
  const { product } = usePieceSheet()
  const isHome = pathname === ROUTES.HOME
  const [pastHero, setPastHero] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPath, setMenuPath] = useState(pathname)
  const wrapRef = useRef(null)
  const burgerRef = useRef(null)

  if (pathname !== menuPath) {
    setMenuPath(pathname)
    setMenuOpen(false)
  }

  useEffect(() => {
    const onScroll = rafThrottle(() =>
      setPastHero(window.scrollY > window.innerHeight * HERO_PASSED),
    )
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      onScroll.cancel()
    }
  }, [])

  const closeMenu = () => setMenuOpen(false)
  useEscapeKey(closeMenu, menuOpen)
  useFocusTrap(wrapRef, menuOpen, burgerRef)

  const solid = (!isHome || pastHero) && !menuOpen
  const toggle = () => {
    buzz()
    setMenuOpen((open) => !open)
  }
  const inquire = () => {
    buzz()
    setMenuOpen(false)
    openDrawer()
  }

  return (
    <div
      ref={wrapRef}
      tabIndex={-1}
      className={`ph-nav${solid ? ' solid' : ''}`}
    >
      <header className="ph-header">
        <Link
          className="ph-header-logo"
          to={ROUTES.HOME}
          aria-label={t.nav.homeAlt}
          tabIndex={solid ? undefined : -1}
          onClick={buzz}
        >
          <span style={{ '--mask': `url(${asset('brand/logo-figure.png')})` }} />
        </Link>
      </header>

      <aside
        id="ph-menu"
        className={`ph-menu${menuOpen ? ' open' : ''}`}
        aria-label={t.nav.menu}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <nav className="ph-menu-items">
          {MENU_ITEMS.map((item, index) => {
            const active = isActive(pathname, item.to)
            const style = { '--delay': `${120 + index * 60}ms` }
            const label = (
              <>
                {copy[item.key]}
                <span className="ph-menu-dot" aria-hidden="true" />
              </>
            )
            return item.to ? (
              <Link
                key={item.key}
                to={item.to}
                className={active ? 'active' : ''}
                aria-current={active ? 'page' : undefined}
                style={style}
                onClick={() => {
                  buzz()
                  closeMenu()
                }}
              >
                {label}
              </Link>
            ) : (
              <button key={item.key} type="button" style={style} onClick={inquire}>
                {label}
              </button>
            )
          })}
        </nav>
        <div className="ph-menu-foot">
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <div className="ph-menu-row">
            <a href={SITE.instagram} target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href={SITE.facebook} target="_blank" rel="noreferrer">
              Facebook
            </a>
            <LanguageSwitch />
          </div>
        </div>
      </aside>

      <button
        ref={burgerRef}
        type="button"
        className={`ph-burger${menuOpen ? ' open' : ''}`}
        aria-expanded={menuOpen}
        aria-controls="ph-menu"
        aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
        hidden={!!product}
        onClick={toggle}
      >
        <span />
        <span />
        <span />
      </button>
    </div>
  )
}
