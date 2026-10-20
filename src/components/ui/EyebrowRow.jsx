import { Reveal } from './Reveal'

/** Small uppercase label row used above galleries and grids: a title on the left, meta on the right.
 *  An optional `mark` (a <Mark />) sits before the title. */
export function EyebrowRow({ start, end, mark }) {
  return (
    <Reveal className="eyebrow-row">
      {mark ? (
        <span className="mark-row">
          {mark}
          {start}
        </span>
      ) : (
        <span>{start}</span>
      )}
      <span>{end}</span>
    </Reveal>
  )
}
