import { Link } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { asset, SITE } from '@/constants/site'
import { useI18n } from '@/i18n/context'

const LINKS = [
  { key: 'catalogue', to: ROUTES.CATALOGUE },
  { key: 'process', to: ROUTES.ONE_OF_ONE },
  { key: 'about', to: ROUTES.ABOUT },
]

/** Phone footer: deliberately sparse — mark, three links, contact, copyright. */
export function PhoneFooter() {
  const { t } = useI18n()

  return (
    <footer className="ph-footer">
      <span
        className="ph-footer-mark"
        role="img"
        aria-label={SITE.name}
        style={{ '--mask': `url(${asset('brand/logo-figure.png')})` }}
      />
      <nav className="ph-footer-links">
        {LINKS.map((link) => (
          <Link key={link.key} to={link.to} className="ph-press">
            {t.phone.nav[link.key]}
          </Link>
        ))}
      </nav>
      <div className="ph-footer-contact">
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        <div>
          <a href={SITE.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href={SITE.facebook} target="_blank" rel="noreferrer">
            Facebook
          </a>
        </div>
      </div>
      <span className="ph-footer-legal">
        © 2026 {SITE.name} · {t.footer.everyPiece}
      </span>
    </footer>
  )
}
