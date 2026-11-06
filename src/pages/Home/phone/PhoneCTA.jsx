import { useContactDrawer } from '@/components/contact/context'
import { Reveal } from '@/components/ui/Reveal'
import { useI18n } from '@/i18n/context'
import { buzz } from '@/utils/haptics'

/** Closing call to action: commissions are open, and the invitation to write. */
export function PhoneCTA() {
  const { t } = useI18n()
  const copy = t.phone.cta
  const { openDrawer } = useContactDrawer()

  return (
    <section className="ph-cta">
      <Reveal as="span" className="ph-status">
        {copy.status}
      </Reveal>
      <Reveal as="h2">{copy.title}</Reveal>
      <Reveal as="p">{copy.text}</Reveal>
      <Reveal
        as="button"
        type="button"
        className="ph-button ph-press"
        onClick={() => {
          buzz()
          openDrawer()
        }}
      >
        <span>{t.contact.triggerAction}</span>
        <span aria-hidden="true">→</span>
      </Reveal>
    </section>
  )
}
