import { useMediaQuery } from './useMediaQuery'

/** Phone layout breakpoint. At or below it the site renders its dedicated phone components. */
export const PHONE_QUERY = '(max-width: 480px)'

export function usePhone() {
  return useMediaQuery(PHONE_QUERY)
}
