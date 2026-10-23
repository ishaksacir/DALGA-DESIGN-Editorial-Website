import { PageHero } from '@/components/ui/PageHero'
import { useReveal } from '@/hooks/useReveal'
import { useI18n } from '@/i18n/context'

/** Shown in place of the site when the catalogue API cannot be reached. */
export function LoadErrorPage() {
  const { t } = useI18n()
  // Rendered instead of the site layout, which normally starts the reveal animations.
  useReveal()

  return (
    <main className="creations-page">
      <PageHero
        className="creations-hero"
        eyebrow={t.loadError.eyebrow}
        title={t.loadError.title}
      />
      <section className="section">
        <p className="lead">
          {t.loadError.text}{' '}
          <button type="button" className="text-link" onClick={() => window.location.reload()}>
            {t.loadError.retry}
          </button>
        </p>
      </section>
    </main>
  )
}
