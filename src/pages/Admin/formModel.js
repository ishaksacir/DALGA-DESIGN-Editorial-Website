import { twoDigits } from '@/utils/format'

/**
 * Converts between the catalogue's product shape and the flat shape the admin form edits.
 * Specs are `[label, value]` pairs in the catalogue; the form keeps them as objects so rows can be edited in place.
 */
export const emptyText = () => ({ bs: '', en: '' })

export const slugify = (text) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const nextNumber = (products) =>
  twoDigits(products.reduce((max, product) => Math.max(max, Number(product.number) || 0), 0) + 1)

export function emptyForm(products) {
  const number = nextNumber(products)
  return {
    id: '',
    number,
    name: emptyText(),
    category: emptyText(),
    collection: { bs: `Narudžba ${number}`, en: `Commission ${number}` },
    year: String(new Date().getFullYear()),
    images: [],
    alt: emptyText(),
    intro: emptyText(),
    description: emptyText(),
    creation: emptyText(),
    composition: emptyText(),
    care: [],
    specs: [],
  }
}

export function toForm(product) {
  return {
    ...product,
    images: product.images ?? (product.img ? [product.img] : []),
    creation: product.creation ?? emptyText(),
    care: product.care ?? [],
    specs: (product.specs ?? []).map(([label, value]) => ({ label, value })),
  }
}

const trimText = (text) => ({ bs: text.bs.trim(), en: text.en.trim() })
const hasText = (text) => Boolean(text.bs || text.en)

export function fromForm(form) {
  const care = form.care.map(trimText).filter(hasText)
  const creation = trimText(form.creation)
  const product = {
    id: form.id.trim(),
    number: form.number.trim(),
    name: trimText(form.name),
    category: trimText(form.category),
    collection: trimText(form.collection),
    year: form.year.trim(),
    img: form.images[0],
    alt: trimText(form.alt),
    intro: trimText(form.intro),
    description: trimText(form.description),
    composition: trimText(form.composition),
    specs: form.specs
      .map(({ label, value }) => [trimText(label), trimText(value)])
      .filter(([label, value]) => hasText(label) || hasText(value)),
  }
  // The catalogue only shows a gallery, care list or creation note when the piece has one.
  if (form.images.length > 1) product.images = form.images
  if (care.length) product.care = care
  if (hasText(creation)) product.creation = creation
  return product
}

const REQUIRED_TEXT = {
  name: 'Name',
  category: 'Category',
  intro: 'Intro',
  alt: 'Image description',
}

/** Returns `{ field: message }`; an empty object means the form can be saved. */
export function validate(form, takenIds) {
  const errors = {}
  const id = form.id.trim()
  if (!id) errors.id = 'Give the piece a URL id.'
  else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))
    errors.id = 'Use lowercase letters, numbers and single dashes.'
  else if (takenIds.includes(id)) errors.id = 'Another piece already uses this id.'

  if (!form.number.trim()) errors.number = 'Add a number.'
  if (!/^\d{4}$/.test(form.year.trim())) errors.year = 'Use a four-digit year.'
  if (!form.images.length) errors.images = 'Add at least one image; the first is the cover.'

  for (const [field, label] of Object.entries(REQUIRED_TEXT)) {
    const text = form[field]
    if (!text.bs.trim() || !text.en.trim())
      errors[field] = `${label} needs both Bosnian and English.`
  }
  if (!form.category.en.trim() && !form.category.bs.trim()) errors.category = 'Choose a category.'
  return errors
}
