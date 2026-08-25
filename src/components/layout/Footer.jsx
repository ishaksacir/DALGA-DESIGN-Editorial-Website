import { Link } from 'react-router-dom'
import { NAV_ITEMS } from '@/constants/navigation'
import { SITE, asset } from '@/constants/site'

export function Footer() {
  return (
    <footer>
      <p className="footer-tag">{SITE.tagline}</p>
      <div className="footer-grid">
        <div>
          <img className="footer-logo" src={asset('dalga-logo-footer.png')} alt={SITE.name} />
          <p>
            A small atelier where garments are not produced, but grown around one person at a time.
          </p>
        </div>
        <div>
          <b>Explore</b>
          {NAV_ITEMS.map((item) => (
            <Link key={item.to} to={item.to}>
              {item.label}
            </Link>
          ))}
        </div>
        <div>
          <b>Follow</b>
          <a href={SITE.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href={SITE.facebook} target="_blank" rel="noreferrer">
            Facebook
          </a>
        </div>
        <div>
          <b>Atelier</b>
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <span>{SITE.commissionsOpen}</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Dalga Design</span>
        <span>Every piece one of one</span>
      </div>
    </footer>
  )
}
