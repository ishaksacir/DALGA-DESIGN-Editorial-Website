import { Reveal } from './Reveal'

/** Small uppercase label row used above galleries and grids: a title on the left, meta on the right. */
export function EyebrowRow({ start, end }) {
  return (
    <Reveal className="eyebrow-row">
      <span>{start}</span>
      <span>{end}</span>
    </Reveal>
  )
}
