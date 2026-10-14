import { Link } from 'react-router-dom'

import { NAV_ITEMS } from '@/constants/navigation'
import { SITE } from '@/constants/site'
import { useI18n } from '@/i18n/context'

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-intro">
          <p className="footer-tagline">
            {t.footer.tagline[0]}
            <br />
            {t.footer.tagline[1]}
          </p>
          <p>{t.footer.intro}</p>
        </div>
        <div className="footer-col">
          <b>{t.footer.explore}</b>
          {NAV_ITEMS.map((item) => (
            <Link key={item.to} to={item.to}>
              {t.nav[item.labelKey]}
            </Link>
          ))}
        </div>
        <div className="footer-col">
          <b>{t.footer.follow}</b>
          <a href={SITE.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href={SITE.facebook} target="_blank" rel="noreferrer">
            Facebook
          </a>
        </div>
        <div className="footer-col">
          <b>{t.footer.atelier}</b>
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <span>{t.site.commissionsOpen}</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Dalga Design</span>
        <span>{t.footer.everyPiece}</span>
      </div>
      <p className="footer-wordmark" aria-hidden="true">
        DALGA
      </p>
    </footer>
  )
}
