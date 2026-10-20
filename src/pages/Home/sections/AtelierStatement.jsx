import { Statement } from '@/components/sections/Statement'
import { Mark } from '@/components/ui/Mark'
import { useI18n } from '@/i18n/context'

export function AtelierStatement() {
  const { t } = useI18n()
  const { label, lead, aside } = t.home.statement

  return (
    <Statement
      ruled
      className="statement-stitched"
      label={label}
      lead={lead}
      aside={aside}
      stamp={
        <Mark name="castleseal" size={88} color="var(--caramel)" className="statement-stamp" />
      }
    >
      <div className="statement-stitches" aria-hidden="true">
        <span className="stitch stitch-running" />
        <span className="stitch stitch-cross" />
      </div>
    </Statement>
  )
}
