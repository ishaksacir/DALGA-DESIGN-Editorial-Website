import { Reveal } from '@/components/ui/Reveal'
import { useI18n } from '@/i18n/context'
import { unquote } from '@/utils/unquote'

/** The founder's line on an ink band, under a large opening quote mark. */
export function AboutQuote() {
  const { t } = useI18n()
  const maker = t.home.maker

  return (
    <section className="about-quote">
      <Reveal as="blockquote">
        <span aria-hidden="true">“</span>
        <p>{unquote(maker.quote)}</p>
        <footer>{maker.credit}</footer>
      </Reveal>
    </section>
  )
}
