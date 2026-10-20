import { useEffect } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'

import { ContactDrawerProvider } from '@/components/contact/ContactDrawerProvider'
import { Footer } from '@/components/layout/Footer'
import { PhoneFooter } from '@/components/layout/PhoneFooter'
import { Navbar } from '@/components/navigation/Navbar'
import { PhoneNav } from '@/components/navigation/PhoneNav'
import { ROUTES } from '@/constants/routes'
import { usePhone } from '@/hooks/usePhone'
import { useReveal } from '@/hooks/useReveal'
import { PieceSheet } from '@/pages/Catalogue/PieceSheet'

const bodyPageForPath = (pathname) => {
  if (pathname === ROUTES.HOME) return 'home'
  if (pathname === ROUTES.ONE_OF_ONE) return 'oneofone'
  if (pathname === ROUTES.ABOUT) return 'about'
  if (pathname.startsWith(ROUTES.CATALOGUE)) return 'catalogue'
  return ''
}

export function AppLayout() {
  const { pathname } = useLocation()
  const isPhone = usePhone()
  useReveal([pathname, isPhone])

  useEffect(() => {
    document.body.dataset.page = bodyPageForPath(pathname)
  }, [pathname])

  return (
    <ContactDrawerProvider>
      <div className={`app${isPhone ? ' app-phone' : ''}`}>
        {isPhone ? <PhoneNav /> : <Navbar />}
        <Outlet />
        {isPhone ? <PhoneFooter /> : <Footer />}
      </div>
      {isPhone && <PieceSheet />}
      {/* New pages open at the top; Back returns to where the reader was. */}
      <ScrollRestoration />
    </ContactDrawerProvider>
  )
}
