import { useId, useState } from 'react'

import { uploadImage } from '@/services/productStore'

import { emptyText } from './formModel'

const LANG_LABEL = { bs: 'Bosanski', en: 'English' }

export function FieldError({ message }) {
  return message ? <p className="admin-error">{message}</p> : null
}

/** One `{ bs, en }` value, with the two languages side by side so translations are written together. */
export function BilingualField({ label, hint, value, onChange, multiline = false, error }) {
  const Input = multiline ? 'textarea' : 'input'
  return (
    <fieldset className={`admin-field admin-bilingual${error ? ' has-error' : ''}`}>
      <legend>{label}</legend>
      {hint && <p className="admin-hint">{hint}</p>}
      <div className="admin-bilingual-grid">
        {['bs', 'en'].map((lang) => (
          <label key={lang} className="admin-lang">
            <span>{LANG_LABEL[lang]}</span>
            <Input
              value={value[lang]}
              rows={multiline ? 4 : undefined}
              onChange={(event) => onChange({ ...value, [lang]: event.target.value })}
            />
          </label>
        ))}
      </div>
      <FieldError message={error} />
    </fieldset>
  )
}

export function TextField({ label, hint, error, ...inputProps }) {
  return (
    <label className={`admin-field${error ? ' has-error' : ''}`}>
      <span className="admin-label">{label}</span>
      <input {...inputProps} />
      {hint && <span className="admin-hint">{hint}</span>}
      <FieldError message={error} />
    </label>
  )
}

/** Picks one of the categories already in the catalogue, or switches to writing a new one. */
export function CategoryField({ value, categories, onChange, error }) {
  const selectId = useId()
  const known = categories.some((category) => category.en === value.en)
  const [custom, setCustom] = useState(Boolean(value.en) && !known)

  const choose = (event) => {
    if (event.target.value === '__new') {
      setCustom(true)
      onChange(emptyText())
      return
    }
    setCustom(false)
    onChange(categories.find((category) => category.en === event.target.value) ?? emptyText())
  }

  return (
    <div className={`admin-field${error ? ' has-error' : ''}`}>
      <label className="admin-label" htmlFor={selectId}>
        Category
      </label>
      <select id={selectId} value={custom ? '__new' : value.en} onChange={choose}>
        <option value="">Choose a category…</option>
        {categories.map((category) => (
          <option key={category.en} value={category.en}>
            {category.en} · {category.bs}
          </option>
        ))}
        <option value="__new">+ New category</option>
      </select>
      {custom && <BilingualField label="New category" value={value} onChange={onChange} />}
      <FieldError message={error} />
    </div>
  )
}

/** Ordered image list: the first is the catalogue cover, the rest form the product gallery. */
export function ImagesField({ images, onChange, error }) {
  const [url, setUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const move = (from, to) => {
    const next = [...images]
    const [image] = next.splice(from, 1)
    next.splice(to, 0, image)
    onChange(next)
  }

  const addUrl = () => {
    const trimmed = url.trim()
    if (!trimmed) return
    onChange([...images, trimmed])
    setUrl('')
  }

  const addFiles = async (event) => {
    const files = [...event.target.files]
    event.target.value = ''
    if (!files.length) return
    setUploading(true)
    setUploadError('')
    try {
      onChange([...images, ...(await Promise.all(files.map(uploadImage)))])
    } catch (failure) {
      setUploadError(failure.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <fieldset className={`admin-field${error ? ' has-error' : ''}`}>
      <legend>Images</legend>
      <p className="admin-hint">The first image is the cover; the rest appear in the gallery.</p>
      {images.length > 0 && (
        <ol className="admin-images">
          {images.map((image, index) => (
            <li key={`${index}-${image.slice(-40)}`}>
              <img src={image} alt="" />
              {index === 0 && <span className="admin-cover-tag">Cover</span>}
              <div className="admin-image-actions">
                <button
                  type="button"
                  onClick={() => move(index, index - 1)}
                  disabled={index === 0}
                  aria-label="Move image earlier"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => move(index, index + 1)}
                  disabled={index === images.length - 1}
                  aria-label="Move image later"
                >
                  →
                </button>
                <button
                  type="button"
                  onClick={() => onChange(images.filter((_, i) => i !== index))}
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}
      <div className="admin-image-add">
        <input
          type="text"
          value={url}
          placeholder="/images/products/…/cover.webp"
          aria-label="Image URL"
          onChange={(event) => setUrl(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              addUrl()
            }
          }}
        />
        <button type="button" className="admin-button" onClick={addUrl}>
          Add URL
        </button>
        <label className="admin-button admin-upload">
          {uploading ? 'Reading…' : 'Upload files'}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            onChange={addFiles}
          />
        </label>
      </div>
      <FieldError message={uploadError} />
      <FieldError message={error} />
    </fieldset>
  )
}

/** Care instructions: a list of bilingual lines. */
export function CareField({ lines, onChange }) {
  const update = (index, line) => onChange(lines.map((item, i) => (i === index ? line : item)))
  return (
    <fieldset className="admin-field">
      <legend>Care</legend>
      {lines.map((line, index) => (
        <div key={index} className="admin-row">
          {['bs', 'en'].map((lang) => (
            <input
              key={lang}
              value={line[lang]}
              placeholder={LANG_LABEL[lang]}
              aria-label={`Care line ${index + 1}, ${LANG_LABEL[lang]}`}
              onChange={(event) => update(index, { ...line, [lang]: event.target.value })}
            />
          ))}
          <RemoveRow onClick={() => onChange(lines.filter((_, i) => i !== index))} />
        </div>
      ))}
      <button
        type="button"
        className="admin-link"
        onClick={() => onChange([...lines, emptyText()])}
      >
        + Add care line
      </button>
    </fieldset>
  )
}

/** Spec rows such as “Fabric — Unbleached cotton”; labels suggest the ones already in use. */
export function SpecsField({ specs, labels, onChange }) {
  const listId = useId()
  const update = (index, spec) => onChange(specs.map((item, i) => (i === index ? spec : item)))

  const setLabel = (index, spec, lang, text) => {
    const match = labels.find((label) => label[lang] === text)
    update(index, { ...spec, label: match ?? { ...spec.label, [lang]: text } })
  }

  return (
    <fieldset className="admin-field">
      <legend>Details</legend>
      <p className="admin-hint">Label and value, in both languages.</p>
      <datalist id={`${listId}-en`}>
        {labels.map((label) => (
          <option key={label.en} value={label.en} />
        ))}
      </datalist>
      <datalist id={`${listId}-bs`}>
        {labels.map((label) => (
          <option key={label.bs} value={label.bs} />
        ))}
      </datalist>
      {specs.map((spec, index) => (
        <div key={index} className="admin-row admin-spec-row">
          {['bs', 'en'].map((lang) => (
            <input
              key={`label-${lang}`}
              list={`${listId}-${lang}`}
              value={spec.label[lang]}
              placeholder={`Label · ${lang.toUpperCase()}`}
              aria-label={`Detail ${index + 1} label, ${LANG_LABEL[lang]}`}
              onChange={(event) => setLabel(index, spec, lang, event.target.value)}
            />
          ))}
          {['bs', 'en'].map((lang) => (
            <input
              key={`value-${lang}`}
              value={spec.value[lang]}
              placeholder={`Value · ${lang.toUpperCase()}`}
              aria-label={`Detail ${index + 1} value, ${LANG_LABEL[lang]}`}
              onChange={(event) =>
                update(index, { ...spec, value: { ...spec.value, [lang]: event.target.value } })
              }
            />
          ))}
          <RemoveRow onClick={() => onChange(specs.filter((_, i) => i !== index))} />
        </div>
      ))}
      <button
        type="button"
        className="admin-link"
        onClick={() => onChange([...specs, { label: emptyText(), value: emptyText() }])}
      >
        + Add detail
      </button>
    </fieldset>
  )
}

function RemoveRow({ onClick }) {
  return (
    <button type="button" className="admin-remove" onClick={onClick} aria-label="Remove row">
      ×
    </button>
  )
}
