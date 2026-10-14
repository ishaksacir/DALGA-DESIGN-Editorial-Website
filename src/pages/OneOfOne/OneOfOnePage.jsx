import { Statement } from '@/components/sections/Statement'
import { useI18n } from '@/i18n/context'
import { OneOfOneHero } from './sections/OneOfOneHero'
import { HowItUnfolds } from './sections/HowItUnfolds'
import { GoodToKnow } from './sections/GoodToKnow'
import { CommissionCTA } from './sections/CommissionCTA'

export function OneOfOnePage() {
  const { t } = useI18n()
  const { label, lead, aside } = t.oneOfOne.statement

  return (
    <main className="oneofone-page">
      <OneOfOneHero />
      <Statement label={label} lead={lead} aside={aside} />
      <HowItUnfolds />
      <GoodToKnow />
      <CommissionCTA />
    </main>
  )
}
