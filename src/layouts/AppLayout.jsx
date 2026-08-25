import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from '@/components/navigation/Navbar'
import { Footer } from '@/components/layout/Footer'
import { useReveal } from '@/hooks/useReveal'
import { useScrollToTop } from '@/hooks/useScrollToTop'
import { ROUTES } from '@/constants/routes'

const bodyPageForPath = (pathname) => {
  if (pathname === ROUTES.HOME) return 'home'
  if (pathname === ROUTES.ONE_OF_ONE) return 'oneofone'
  if (pathname === ROUTES.ABOUT) return 'about'
  if (pathname.startsWith(ROUTES.CATALOGUE)) return 'catalogue'
  return ''
}

export function AppLayout() {
  const { pathname } = useLocation()
  useScrollToTop()
  useReveal([pathname])

  useEffect(() => {
    document.body.dataset.page = bodyPageForPath(pathname)
  }, [pathname])

  return (
    <div className="app">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}
