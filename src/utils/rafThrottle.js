/**
 * Wraps `callback` so repeated calls (scroll, resize) run it at most once per animation frame.
 * Call `.cancel()` on the returned function to drop a pending frame.
 */
export function rafThrottle(callback) {
  let frame = null
  const run = () => {
    frame = null
    callback()
  }
  const schedule = () => {
    if (frame === null) frame = requestAnimationFrame(run)
  }
  schedule.cancel = () => {
    if (frame !== null) cancelAnimationFrame(frame)
  }
  return schedule
}
