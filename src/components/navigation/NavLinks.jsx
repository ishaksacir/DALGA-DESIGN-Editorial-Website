import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '@/constants/navigation'

export function NavLinks({ className = '', onLinkClick }) {
  return (
    <div className={`nav-links ${className}`}>
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onLinkClick}
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  )
}
