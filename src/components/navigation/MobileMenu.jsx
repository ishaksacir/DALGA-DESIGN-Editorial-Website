import { useRef } from 'react'

import { useEscapeKey } from '@/hooks/useEscapeKey'
import { useOutsideClick } from '@/hooks/useOutsideClick'

import { NavLinks } from './NavLinks'

export function MobileMenu({ open, onClose }) {
  const panelRef = useRef(null)
  useOutsideClick(panelRef, onClose, open)
  useEscapeKey(onClose, open)

  return (
    <div
      id="mobile-nav-panel"
      ref={panelRef}
      className={`nav-mobile-panel ${open ? 'open' : ''}`}
      inert={!open}
    >
      <NavLinks className="nav-mobile-links" onLinkClick={onClose} />
    </div>
  )
}
