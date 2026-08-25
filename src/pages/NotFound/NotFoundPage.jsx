import { Link } from 'react-router-dom'
import { PageHero } from '@/components/ui/PageHero'
import { ROUTES } from '@/constants/routes'

export function NotFoundPage() {
  return (
    <main className="creations-page">
      <PageHero className="creations-hero" eyebrow="404" title="Page not found" />
      <section className="section">
        <p className="lead">
          That page doesn’t exist. <Link to={ROUTES.HOME}>Return home →</Link>
        </p>
      </section>
    </main>
  )
}
