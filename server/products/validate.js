/**
 * Server-side check of a product sent by the admin. Mirrors the admin form's rules so a request
 * that skips the form still cannot store a broken piece. Returns `{ field: message }`.
 */
const isText = (value) =>
  value !== null &&
  typeof value === 'object' &&
  typeof value.bs === 'string' &&
  typeof value.en === 'string'

const isFilled = (value) => isText(value) && value.bs.trim() !== '' && value.en.trim() !== ''

const REQUIRED_TEXT = [
  'name',
  'category',
  'collection',
  'alt',
  'intro',
  'description',
  'composition',
]

export function validateProduct(product) {
  if (!product || typeof product !== 'object')
    return { product: 'Send the piece as a JSON object.' }
  const errors = {}

  if (typeof product.id !== 'string' || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(product.id))
    errors.id = 'Use lowercase letters, numbers and single dashes.'
  if (typeof product.number !== 'string' || !product.number.trim()) errors.number = 'Add a number.'
  if (!/^\d{4}$/.test(String(product.year ?? ''))) errors.year = 'Use a four-digit year.'

  for (const field of REQUIRED_TEXT) {
    if (!isText(product[field])) errors[field] = 'Expected { bs, en } text.'
  }
  for (const field of ['name', 'category', 'alt', 'intro']) {
    if (!errors[field] && !isFilled(product[field]))
      errors[field] = 'Needs both Bosnian and English.'
  }
  if (product.creation != null && !isText(product.creation))
    errors.creation = 'Expected { bs, en } text.'

  const images = product.images ?? (product.img ? [product.img] : [])
  if (
    !Array.isArray(images) ||
    !images.length ||
    !images.every((url) => typeof url === 'string' && url)
  )
    errors.images = 'Add at least one image; the first is the cover.'

  const specs = product.specs ?? []
  if (
    !Array.isArray(specs) ||
    !specs.every((spec) => Array.isArray(spec) && spec.length === 2 && spec.every(isText))
  )
    errors.specs = 'Each detail needs a { bs, en } label and value.'

  const care = product.care ?? []
  if (!Array.isArray(care) || !care.every(isText))
    errors.care = 'Each care line needs { bs, en } text.'

  return errors
}
