import { useI18n } from '@/i18n/context'

/** Two-line button that opens the mobile menu. Shown only below the compact-nav breakpoint. */
export function MenuToggle({ expanded, onClick }) {
  const { t } = useI18n()

  return (
    <button
      type="button"
      className="nav-toggle"
      aria-expanded={expanded}
      aria-controls="mobile-nav-panel"
      aria-label={t.nav.openMenu}
      onClick={onClick}
    >
      <span />
      <span />
    </button>
  )
}
