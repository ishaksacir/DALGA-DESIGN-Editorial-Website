import { usePhone } from '@/hooks/usePhone'

import { ProcessPhone } from './ProcessPhone'
import { Faq } from './sections/Faq'
import { GoodToKnow } from './sections/GoodToKnow'
import { HowItUnfolds } from './sections/HowItUnfolds'
import { OneOfOneHero } from './sections/OneOfOneHero'

export function OneOfOnePage() {
  return usePhone() ? <ProcessPhone /> : <OneOfOneEditorial />
}

function OneOfOneEditorial() {
  return (
    <main className="oneofone-page">
      <OneOfOneHero />
      <HowItUnfolds />
      <GoodToKnow />
      <Faq />
    </main>
  )
}
