import { useEffect } from 'react'

/** Calls `onEscape` when Escape is pressed. Skips when `enabled` is false. */
export function useEscapeKey(onEscape, enabled = true) {
  useEffect(() => {
    if (!enabled) return
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onEscape()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onEscape, enabled])
}
