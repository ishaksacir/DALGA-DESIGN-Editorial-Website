import { asset } from '@/constants/site'

/**
 * One of the atelier's marks (`public/images/brand/marks/<name>.png`), drawn as a CSS mask so its
 * colour comes from `color`. Always decorative. `size` is a number (px) or any CSS length.
 */
export function Mark({ name, size, color, className = '' }) {
  const mask = `url(${asset(`brand/marks/${name}.png`)}) center / contain no-repeat`

  return (
    <span
      aria-hidden="true"
      className={`mark ${className}`.trim()}
      style={{ width: size, height: size, background: color, WebkitMask: mask, mask }}
    />
  )
}
