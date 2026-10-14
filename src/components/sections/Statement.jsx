import { Reveal } from '@/components/ui/Reveal'

/** Large serif statement with a small label column; `aside` renders in the muted tone after the lead. */
export function Statement({ label, lead, aside, ruled = false }) {
  return (
    <section className={`statement${ruled ? ' statement-ruled' : ''}`}>
      <Reveal className="statement-inner">
        <p className="statement-label">{label}</p>
        <p className="statement-text">
          {lead} <span>{aside}</span>
        </p>
      </Reveal>
    </section>
  )
}
