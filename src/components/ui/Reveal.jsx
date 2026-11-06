/** Scroll-reveal wrapper. Pairs with `useReveal`, which sets `data-revealed` via IntersectionObserver. */
export function Reveal({ as: Tag = 'div', className = '', children, ...props }) {
  return (
    <Tag className={`reveal ${className}`} {...props}>
      {children}
    </Tag>
  )
}
