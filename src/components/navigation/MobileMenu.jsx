import { useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'

import { NAV_ITEMS } from '@/constants/navigation'
import { ROUTES } from '@/constants/routes'
import { asset, SITE } from '@/constants/site'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { useI18n } from '@/i18n/context'

import { LanguageSwitch } from './LanguageSwitch'

const pad2 = (n) => String(n).padStart(2, '0')

/**
 * Full-screen menu for narrow screens. It carries its own logo and close button, so either
 * the page nav or the scroll bar can open it. `returnFocusRef` holds the button that opened it.
 */
export function MobileMenu({ open, onClose, onGetPiece, returnFocusRef }) {
  const { t } = useI18n()
  const panelRef = useRef(null)
  useEscapeKey(onClose, open)
  useFocusTrap(panelRef, open, returnFocusRef)

  return (
    <div
      id="mobile-nav-panel"
      ref={panelRef}
      className={`nav-mobile-panel${open ? ' open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={t.nav.menu}
      tabIndex={-1}
      inert={!open}
    >
      <div className="nav-mobile-top">
        <Link className="brand" to={ROUTES.HOME} onClick={onClose}>
          <img src={asset('brand/logo-figure.png')} alt={t.nav.homeAlt} />
        </Link>
        <button
          type="button"
          className="nav-toggle nav-mobile-close"
          aria-label={t.nav.closeMenu}
          onClick={onClose}
        >
          <span />
          <span />
        </button>
      </div>

      <nav className="nav-mobile-links">
        {NAV_ITEMS.map((item, index) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <span className="nav-mobile-num">{pad2(index + 1)}</span>
            {t.nav[item.labelKey]}
          </NavLink>
        ))}
      </nav>

      <div className="nav-mobile-foot">
        <button type="button" className="nav-mobile-cta" onClick={onGetPiece}>
          <span>{t.contact.trigger}</span>
          <span aria-hidden="true">→</span>
        </button>
        <p className="nav-mobile-status">{t.site.commissionsOpen}</p>
        <a className="nav-mobile-email" href={`mailto:${SITE.email}`}>
          {SITE.email}
        </a>
        <div className="nav-mobile-social">
          <a href={SITE.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href={SITE.facebook} target="_blank" rel="noreferrer">
            Facebook
          </a>
          <LanguageSwitch />
        </div>
      </div>
    </div>
  )
}
