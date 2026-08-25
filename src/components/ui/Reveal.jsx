/** Scroll-reveal wrapper. Pairs with `useReveal`, which toggles `.visible` via IntersectionObserver. */
export function Reveal({ as: Tag = 'div', className = '', children, ...props }) {
  return (
    <Tag className={`reveal ${className}`} {...props}>
      {children}
    </Tag>
  )
}
