import { PhoneAbout } from './PhoneAbout'
import { PhoneCTA } from './PhoneCTA'
import { PhoneHero } from './PhoneHero'
import { PhoneNews } from './PhoneNews'
import { PhoneRule } from './PhoneRule'
import { PhoneSteps } from './PhoneSteps'
import { PhoneWork } from './PhoneWork'

/** Home page on phones (≤ 480px): its own section order and layouts, per the phone design. */
export function HomePhone() {
  return (
    <main className="ph-home">
      <PhoneHero />
      <PhoneWork />
      <PhoneRule />
      <PhoneNews />
      <PhoneSteps />
      <PhoneAbout />
      <PhoneCTA />
    </main>
  )
}
