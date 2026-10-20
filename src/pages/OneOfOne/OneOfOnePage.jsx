import { Statement } from '@/components/sections/Statement'
import { usePhone } from '@/hooks/usePhone'
import { useI18n } from '@/i18n/context'

import { ProcessPhone } from './ProcessPhone'
import { GoodToKnow } from './sections/GoodToKnow'
import { HowItUnfolds } from './sections/HowItUnfolds'
import { OneOfOneHero } from './sections/OneOfOneHero'

export function OneOfOnePage() {
  return usePhone() ? <ProcessPhone /> : <OneOfOneEditorial />
}

function OneOfOneEditorial() {
  const { t } = useI18n()
  const { label, lead, aside } = t.oneOfOne.statement

  return (
    <main className="oneofone-page">
      <OneOfOneHero />
      <Statement label={label} lead={lead} aside={aside} />
      <HowItUnfolds />
      <GoodToKnow />
    </main>
  )
}
