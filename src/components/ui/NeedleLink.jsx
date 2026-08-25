import { Link } from 'react-router-dom'
import { asset } from '@/constants/site'

/**
 * The atelier's signature button: label swaps for a needle icon on hover.
 * Pass `to` for an internal route or `href` for an external/mailto link.
 */
export function NeedleLink({ children, to, href, dark = false, ...props }) {
  const className = `needle-btn ${dark ? 'on-dark' : ''}`
  const icon = <img src={asset(dark ? 'needle-black.png' : 'needle-white.png')} alt="" />

  if (to) {
    return (
      <Link className={className} to={to} {...props}>
        <span>{children}</span>
        {icon}
      </Link>
    )
  }

  return (
    <a className={className} href={href} {...props}>
      <span>{children}</span>
      {icon}
    </a>
  )
}
