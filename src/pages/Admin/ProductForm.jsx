import { useEffect, useMemo, useState } from 'react'

import { productPath } from '@/constants/routes'

import {
  BilingualField,
  CareField,
  CategoryField,
  ImagesField,
  SpecsField,
  TextField,
} from './AdminFields'
import { emptyForm, fromForm, slugify, toForm, validate } from './formModel'

/** Unique `{ bs, en }` values across the catalogue, keyed by their English text. */
const uniqueTexts = (texts) => [...new Map(texts.map((text) => [text.en, text])).values()]

/**
 * Edits one piece, or a new one when `product` is null. Remount it with a `key` to load another piece.
 * Calls `onDirtyChange` so the page can warn before unsaved edits are thrown away.
 */
export function ProductForm({ product, products, onSave, onDelete, onClose, onDirtyChange }) {
  const isNew = !product
  const initial = useMemo(
    () => (product ? toForm(product) : emptyForm(products)),
    [product, products],
  )
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  // New pieces take their id from the English name until the id is typed by hand.
  const [idTouched, setIdTouched] = useState(!isNew)

  const dirty = JSON.stringify(form) !== JSON.stringify(initial)
  useEffect(() => onDirtyChange(dirty), [dirty, onDirtyChange])

  const categories = useMemo(() => uniqueTexts(products.map((item) => item.category)), [products])
  const specLabels = useMemo(
    () => uniqueTexts(products.flatMap((item) => (item.specs ?? []).map(([label]) => label))),
    [products],
  )
  const takenIds = products.map((item) => item.id).filter((id) => id !== product?.id)

  const set = (field) => (value) => {
    setForm((current) => {
      const next = { ...current, [field]: value }
      if (field === 'name' && !idTouched) next.id = slugify(value.en)
      return next
    })
    if (errors[field]) setErrors(({ [field]: _, ...rest }) => rest)
  }

  const submit = async (event) => {
    event.preventDefault()
    const found = validate(form, takenIds)
    setErrors(found)
    if (Object.keys(found).length) {
      // Wait for the error styles to render, then bring the first problem into view.
      requestAnimationFrame(() =>
        document.querySelector('.admin-form .has-error')?.scrollIntoView({ block: 'center' }),
      )
      return
    }
    setSaving(true)
    setSaveError('')
    try {
      await onSave(fromForm(form), product?.id)
    } catch (error) {
      // The server repeats the form's checks and also catches an id taken since the list loaded.
      setErrors(error.fields ?? {})
      setSaveError(error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="admin-form" onSubmit={submit} noValidate>
      <header className="admin-form-head">
        <div>
          <p className="admin-eyebrow">{isNew ? 'New piece' : `Piece ${product.number}`}</p>
          <h2>{form.name.en || form.name.bs || 'Untitled piece'}</h2>
        </div>
        {!isNew && (
          <a className="admin-link" href={productPath(product.id)} target="_blank" rel="noreferrer">
            View on site ↗
          </a>
        )}
      </header>

      <section className="admin-section">
        <h3>Basics</h3>
        <BilingualField label="Name" value={form.name} onChange={set('name')} error={errors.name} />
        <CategoryField
          value={form.category}
          categories={categories}
          onChange={set('category')}
          error={errors.category}
        />
        <div className="admin-inline">
          <TextField
            label="Number"
            value={form.number}
            onChange={(event) => set('number')(event.target.value)}
            error={errors.number}
          />
          <TextField
            label="Year"
            inputMode="numeric"
            value={form.year}
            onChange={(event) => set('year')(event.target.value)}
            error={errors.year}
          />
          <TextField
            label="URL id"
            value={form.id}
            hint={form.id ? productPath(form.id) : 'Filled from the English name'}
            onChange={(event) => {
              setIdTouched(true)
              set('id')(event.target.value)
            }}
            error={errors.id}
          />
        </div>
        <BilingualField label="Collection" value={form.collection} onChange={set('collection')} />
      </section>

      <section className="admin-section">
        <h3>Images</h3>
        <ImagesField images={form.images} onChange={set('images')} error={errors.images} />
        <BilingualField
          label="Image description"
          hint="Read aloud by screen readers in place of the cover image."
          value={form.alt}
          onChange={set('alt')}
          error={errors.alt}
        />
      </section>

      <section className="admin-section">
        <h3>Story</h3>
        <BilingualField
          label="Intro"
          hint="The italic line under the title."
          value={form.intro}
          onChange={set('intro')}
          multiline
          error={errors.intro}
        />
        <BilingualField
          label="Description"
          value={form.description}
          onChange={set('description')}
          multiline
        />
        <BilingualField
          label="How it was made"
          hint="Optional."
          value={form.creation}
          onChange={set('creation')}
          multiline
        />
      </section>

      <section className="admin-section">
        <h3>Material &amp; care</h3>
        <BilingualField
          label="Composition"
          value={form.composition}
          onChange={set('composition')}
        />
        <SpecsField specs={form.specs} labels={specLabels} onChange={set('specs')} />
        <CareField lines={form.care} onChange={set('care')} />
      </section>

      <footer className="admin-form-actions">
        {!isNew && (
          <button
            type="button"
            className="admin-button admin-danger"
            onClick={() => onDelete(product)}
          >
            Delete
          </button>
        )}
        <span className="admin-spacer">
          {saveError && <span className="admin-error">{saveError}</span>}
        </span>
        <button type="button" className="admin-button" onClick={onClose}>
          {dirty ? 'Discard' : 'Close'}
        </button>
        <button type="submit" className="admin-button admin-primary" disabled={saving || !dirty}>
          {saving ? 'Saving…' : isNew ? 'Add piece' : 'Save changes'}
        </button>
      </footer>
    </form>
  )
}
