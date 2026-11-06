import { LanguageSwitch } from '@/components/navigation/LanguageSwitch'
import { Mark } from '@/components/ui/Mark'
import { NeedleLink } from '@/components/ui/NeedleLink'
import { Reveal } from '@/components/ui/Reveal'
import { ROUTES } from '@/constants/routes'
import { asset, SITE } from '@/constants/site'
import { useReveal } from '@/hooks/useReveal'
import { useI18n } from '@/i18n/context'

/**
 * Shown in place of the whole site when the catalogue API cannot be reached, so it brings its own
 * slim header and footer band. Reloading retries the catalogue; the email is the way through meanwhile.
 */
export function LoadErrorPage() {
  const { t } = useI18n()
  const copy = t.loadError
  // Rendered instead of the site layout, which normally starts the reveal animations.
  useReveal()

  return (
    <div className="load-error">
      <header className="load-error-bar">
        {/* A full page load rather than a router link: it is also a retry. */}
        <a className="brand" href={ROUTES.HOME}>
          <img src={asset('brand/logo-figure.png')} alt={t.nav.homeAlt} />
        </a>
        <LanguageSwitch />
      </header>

      <main className="load-error-main">
        <Reveal className="load-error-status">
          <span className="mark-row">
            <Mark name="spiral" size={18} color="var(--accent)" />
            {copy.eyebrow}
          </span>
          <span>{copy.status}</span>
        </Reveal>
        <div className="load-error-body">
          <Reveal as="h1">
            {copy.title} <em>{copy.titleAccent}</em>
          </Reveal>
          <Reveal className="load-error-aside">
            <p>{copy.text}</p>
            <NeedleLink onClick={() => window.location.reload()}>{copy.retry}</NeedleLink>
            <p className="load-error-write">
              {copy.write} <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </p>
          </Reveal>
        </div>
      </main>

      <div className="fabric-strip" aria-hidden="true" />
      <footer className="load-error-band" aria-hidden="true">
        <p>DALGA</p>
      </footer>
    </div>
  )
}
