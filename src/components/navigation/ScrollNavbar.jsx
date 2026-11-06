import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { useContactDrawer } from '@/components/contact/context'
import { NeedleLink } from '@/components/ui/NeedleLink'
import { ROUTES } from '@/constants/routes'
import { asset } from '@/constants/site'
import { useI18n } from '@/i18n/context'
import { rafThrottle } from '@/utils/rafThrottle'

import { MenuToggle } from './MenuToggle'
import { NavLinks } from './NavLinks'

/** Below this share of the viewport the page's own nav is in view, so this bar stays hidden. */
const HERO_ZONE = 0.6
/** Scroll distance (px) that counts as a deliberate change of direction. */
const DIRECTION_THRESHOLD = 4

/** Solid bar that slides in when the reader scrolls back up past the top of any page. */
export function ScrollNavbar({ menuOpen, onMenuOpen }) {
  const { t } = useI18n()
  const { openDrawer, isOpen: drawerOpen } = useContactDrawer()
  const [scrolledUp, setScrolledUp] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY
    let current = false
    const update = (next) => {
      if (next === current) return
      current = next
      setScrolledUp(next)
    }
    const onScroll = rafThrottle(() => {
      const y = window.scrollY
      const delta = y - lastY
      lastY = y
      if (y < window.innerHeight * HERO_ZONE) update(false)
      else if (delta < -DIRECTION_THRESHOLD) update(true)
      else if (delta > DIRECTION_THRESHOLD) update(false)
    })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      onScroll.cancel()
    }
  }, [])

  const shown = scrolledUp && !drawerOpen

  return (
    <nav className={`scroll-nav${shown ? ' shown' : ''}`} aria-hidden={!shown} inert={!shown}>
      <Link className="brand" to={ROUTES.HOME}>
        <img src={asset('brand/logo-figure.png')} alt={t.nav.homeAlt} />
      </Link>
      <div className="scroll-nav-end">
        <NavLinks className="nav-links-desktop" />
        <NeedleLink className="nav-cta nav-cta-solid" onClick={() => openDrawer()}>
          {t.contact.trigger}
        </NeedleLink>
        <MenuToggle expanded={menuOpen} onClick={onMenuOpen} />
      </div>
    </nav>
  )
}
