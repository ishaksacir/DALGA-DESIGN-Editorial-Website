import { Reveal } from '@/components/ui/Reveal'

/** Large serif statement with a small label column; `aside` renders in the muted tone after the lead.
 *  An optional `stamp` (a <Mark />) sits under the label; `className` adds a per-page variant;
 *  `children` render inside the section, after the content (decoration such as stitches). */
export function Statement({ label, lead, aside, stamp, ruled = false, className = '', children }) {
  return (
    <section
      className={`statement${ruled ? ' statement-ruled' : ''}${className ? ` ${className}` : ''}`}
    >
      <Reveal className="statement-inner">
        {stamp ? (
          <div>
            <p className="statement-label">{label}</p>
            {stamp}
          </div>
        ) : (
          <p className="statement-label">{label}</p>
        )}
        <p className="statement-text">
          {lead} <span>{aside}</span>
        </p>
      </Reveal>
      {children}
    </section>
  )
}
