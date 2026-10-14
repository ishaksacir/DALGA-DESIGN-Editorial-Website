import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '@/constants/navigation'
import { useI18n } from '@/i18n/context'

export function NavLinks({ className = '', onLinkClick }) {
  const { t } = useI18n()

  return (
    <div className={`nav-links ${className}`}>
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onLinkClick}
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          {t.nav[item.labelKey]}
        </NavLink>
      ))}
    </div>
  )
}
