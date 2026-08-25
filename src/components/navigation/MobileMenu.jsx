import { useEffect, useRef } from 'react'
import { useOutsideClick } from '@/hooks/useOutsideClick'
import { NavLinks } from './NavLinks'

export function MobileMenu({ open, onClose }) {
  const panelRef = useRef(null)
  useOutsideClick(panelRef, onClose, open)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

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
