import { Statement } from '@/components/sections/Statement'
import { useI18n } from '@/i18n/context'

export function AtelierStatement() {
  const { t } = useI18n()
  const { label, lead, aside } = t.home.statement

  return <Statement ruled label={label} lead={lead} aside={aside} />
}
