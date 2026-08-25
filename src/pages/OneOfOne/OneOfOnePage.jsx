import { OneOfOneIntro } from './sections/OneOfOneIntro'
import { CommissionCTA } from './sections/CommissionCTA'
import { CommissionJourney } from '@/components/sections/CommissionJourney'

export function OneOfOnePage() {
  return (
    <main className="oneofone-page">
      <OneOfOneIntro />
      <CommissionJourney />
      <CommissionCTA />
    </main>
  )
}
