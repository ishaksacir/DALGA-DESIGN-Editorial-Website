import { Link } from 'react-router-dom'

import { Reveal } from '@/components/ui/Reveal'
import { ROUTES } from '@/constants/routes'
import { asset } from '@/constants/site'
import { useI18n } from '@/i18n/context'
import { buzz } from '@/utils/haptics'

/** Home "About" band on white: the founder, her line, and a way through to the About page. */
export function PhoneAbout() {
  const { t } = useI18n()

  return (
    <section className="ph-about-band">
      <Reveal className="ph-about-band-photo">
        <img src={asset('about/founder.webp')} alt={t.home.maker.imageAlt} loading="lazy" />
      </Reveal>
      <Reveal as="blockquote">{t.home.maker.quote}</Reveal>
      <div className="ph-about-band-foot">
        <span>{t.phone.about.credit}</span>
        <Link className="ph-label-link" to={ROUTES.ABOUT} onClick={buzz}>
          {t.phone.about.link}
        </Link>
      </div>
    </section>
  )
}
