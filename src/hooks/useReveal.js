import { useEffect } from 'react'

/**
 * Watches every `.reveal` element within `scopeRef` (defaults to the whole
 * document) and sets `data-revealed` once it scrolls into view. Re-scans whenever
 * a value in `deps` changes, since new `.reveal` nodes can mount (route
 * change, filter change, etc). An attribute rather than a class, because React
 * rewrites `className` on re-render and would hide an element whose classes change.
 */
export function useReveal(deps = [], scopeRef = null) {
  useEffect(() => {
    const scope = scopeRef?.current ?? document
    const elements = scope.querySelectorAll('.reveal:not([data-revealed])')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.dataset.revealed = ''
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 },
    )
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
