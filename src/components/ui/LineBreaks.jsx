import { Fragment } from 'react'

/** Renders copy stored as an array of lines, with a `<br />` between each. */
export function LineBreaks({ lines }) {
  return lines.map((line, index) => (
    <Fragment key={index}>
      {index > 0 && <br />}
      {line}
    </Fragment>
  ))
}
