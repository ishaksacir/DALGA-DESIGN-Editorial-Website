import { Link } from 'react-router-dom'
import { PageHero } from '@/components/ui/PageHero'
import { ROUTES } from '@/constants/routes'
import { useI18n } from '@/i18n/context'

export function NotFoundPage() {
  const { t } = useI18n()

  return (
    <main className="creations-page">
      <PageHero className="creations-hero" eyebrow="404" title={t.notFound.title} />
      <section className="section">
        <p className="lead">
          {t.notFound.text} <Link to={ROUTES.HOME}>{t.notFound.link}</Link>
        </p>
      </section>
    </main>
  )
}
