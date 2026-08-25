import { Reveal } from './Reveal'

/** Small uppercase label row used above galleries and grids: a title on the left, meta on the right. */
export function EyebrowRow({ start, end, className = '' }) {
  return (
    <Reveal className={`eyebrow-row ${className}`}>
      <span>{start}</span>
      <span>{end}</span>
    </Reveal>
  )
}
