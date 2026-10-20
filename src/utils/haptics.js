/** A short tap of vibration on devices that support it (Android); a no-op everywhere else. */
export function buzz() {
  try {
    navigator.vibrate?.(8)
  } catch {
    // Some browsers throw when vibration is blocked; feedback is optional.
  }
}
