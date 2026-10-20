import { Link } from 'react-router-dom'

import { asset } from '@/constants/site'

/**
 * The atelier's signature button: on hover the label fades and a needle slides in.
 * Pass `to` for an internal route, `href` for an external/mailto link, or neither for a button.
 * `className` replaces the default outlined look; `needle` picks the icon ('white' | 'black')
 * to contrast with the hover background.
 */
export function NeedleLink({
  children,
  to,
  href,
  className = 'needle-btn',
  needle = 'white',
  ...props
}) {
  const classes = `needle-hover ${className}`
  const icon = <img src={asset(`ui/needle-${needle}.png`)} alt="" />
  const content = (
    <>
      <span>{children}</span>
      {icon}
    </>
  )

  if (to) {
    return (
      <Link className={classes} to={to} {...props}>
        {content}
      </Link>
    )
  }

  if (!href) {
    return (
      <button type="button" className={classes} {...props}>
        {content}
      </button>
    )
  }

  return (
    <a className={classes} href={href} {...props}>
      {content}
    </a>
  )
}
