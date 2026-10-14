import { createContext, useContext } from 'react'

export const ContactDrawerContext = createContext(null)

/** `openDrawer(productId?)` opens the "Get your piece" drawer, optionally with that piece pre-tagged. */
export function useContactDrawer() {
  const context = useContext(ContactDrawerContext)
  if (!context) throw new Error('useContactDrawer must be used inside <ContactDrawerProvider>')
  return context
}
