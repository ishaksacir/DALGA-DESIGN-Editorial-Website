import { useEffect } from 'react'

/** Calls `onOutsideClick` when a pointer or focus event lands outside `ref`. Skips when `enabled` is false. */
export function useOutsideClick(ref, onOutsideClick, enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const handlePointerDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onOutsideClick(event)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [ref, onOutsideClick, enabled])
}
