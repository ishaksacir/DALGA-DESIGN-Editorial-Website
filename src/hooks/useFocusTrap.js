import { useEffect } from 'react'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled])'

/**
 * While `active`: locks page scroll, moves focus into `panelRef` and keeps Tab cycling inside it.
 * On deactivation, focus returns to the element held in `returnFocusRef`, unless focus has already
 * moved on to another panel (say, the contact drawer opened from the piece sheet).
 *
 * Pass `{ lockScroll: false }` when the caller locks scroll itself.
 */
export function useFocusTrap(panelRef, active, returnFocusRef, { lockScroll = true } = {}) {
  useEffect(() => {
    if (!active) return
    const panel = panelRef.current
    const returnTo = returnFocusRef.current
    panel.focus({ preventScroll: true })
    if (lockScroll) document.body.style.overflow = 'hidden'

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
      if (lockScroll) document.body.style.overflow = ''
      const focused = document.activeElement
      if (!focused || focused === document.body || panel.contains(focused)) {
        returnTo?.focus?.({ preventScroll: true })
      }
    }
  }, [panelRef, active, returnFocusRef, lockScroll])
}
