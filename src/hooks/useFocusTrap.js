import { useEffect } from 'react'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled])'

/**
 * While `active`: locks page scroll, moves focus into `panelRef` and keeps Tab cycling inside it.
 * On deactivation, focus returns to the element held in `returnFocusRef`.
 */
export function useFocusTrap(panelRef, active, returnFocusRef) {
  useEffect(() => {
    if (!active) return
    const panel = panelRef.current
    const returnTo = returnFocusRef.current
    panel.focus()
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event) => {
      if (event.key !== 'Tab') return
      const items = [...panel.querySelectorAll(FOCUSABLE)]
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (
        event.shiftKey &&
        (document.activeElement === first || document.activeElement === panel)
      ) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
      returnTo?.focus?.()
    }
  }, [panelRef, active, returnFocusRef])
}
