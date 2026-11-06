import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { SITE } from '@/constants/site'
import {
  deleteProduct,
  getSession,
  listProducts,
  logOut,
  saveProduct,
} from '@/services/productStore'

import { AdminLogin } from './AdminLogin'
import { ProductForm } from './ProductForm'

import '@/styles/admin.css'

const NEW = 'new'

/** Product admin: a searchable list of pieces beside an editor for adding or changing one. */
export function AdminPage() {
  // null while the login check runs, then true or false.
  const [admin, setAdmin] = useState(null)
  const [products, setProducts] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [query, setQuery] = useState('')
  const [notice, setNotice] = useState('')
  const dirtyRef = useRef(false)

  useEffect(() => {
    document.body.dataset.page = 'admin'
    getSession()
      .then(setAdmin)
      .catch((error) => {
        setAdmin(false)
        setLoadError(error.message)
      })
  }, [])

  useEffect(() => {
    if (!admin) return
    listProducts()
      .then(setProducts)
      .catch((error) => setLoadError(error.message))
  }, [admin])

  useEffect(() => {
    if (!notice) return undefined
    const timer = setTimeout(() => setNotice(''), 4000)
    return () => clearTimeout(timer)
  }, [notice])

  // Warn before leaving the page with unsaved edits.
  useEffect(() => {
    const warn = (event) => {
      if (dirtyRef.current) event.preventDefault()
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [])

  const setDirty = useCallback((dirty) => {
    dirtyRef.current = dirty
  }, [])

  const select = (id) => {
    if (id === selectedId) return
    if (dirtyRef.current && !window.confirm('Discard your unsaved changes?')) return
    dirtyRef.current = false
    setSelectedId(id)
  }

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!products || !needle) return products ?? []
    return products.filter((product) =>
      [
        product.number,
        product.id,
        product.year,
        ...Object.values(product.name),
        ...Object.values(product.category),
      ]
        .join(' ')
        .toLowerCase()
        .includes(needle),
    )
  }, [products, query])

  // An expired login sends the admin back to the password screen; unsaved edits are lost.
  const signedOut = (error) => {
    if (error.status === 401) {
      dirtyRef.current = false
      setAdmin(false)
    }
  }

  /** Errors are rethrown so the form can show them beside the fields. */
  const save = async (product, previousId) => {
    try {
      const saved = await saveProduct(product, previousId)
      setProducts(await listProducts())
      dirtyRef.current = false
      setSelectedId(saved.id)
      setNotice(`“${saved.name.en}” saved.`)
    } catch (error) {
      signedOut(error)
      throw error
    }
  }

  const remove = async (product) => {
    if (!window.confirm(`Delete “${product.name.en}”? This cannot be undone.`)) return
    try {
      await deleteProduct(product.id)
      setProducts(await listProducts())
      dirtyRef.current = false
      setSelectedId(null)
      setNotice(`“${product.name.en}” deleted.`)
    } catch (error) {
      signedOut(error)
      setNotice(error.message)
    }
  }

  const logout = async () => {
    if (dirtyRef.current && !window.confirm('Discard your unsaved changes?')) return
    await logOut().catch(() => {})
    dirtyRef.current = false
    setSelectedId(null)
    setProducts(null)
    setAdmin(false)
  }

  if (admin === null) return <div className="admin" />
  if (!admin) {
    return (
      <>
        <AdminLogin onLogin={setAdmin} />
        {loadError && (
          <p className="admin-notice" role="alert">
            {loadError}
          </p>
        )}
      </>
    )
  }

  const selected = products?.find((product) => product.id === selectedId) ?? null
  const editing = selectedId === NEW || selected

  return (
    <div className={`admin${editing ? ' is-editing' : ''}`}>
      <header className="admin-bar">
        <Link to={ROUTES.HOME} className="admin-brand">
          {SITE.name}
        </Link>
        <span className="admin-bar-title">Atelier admin</span>
        <Link to={ROUTES.CATALOGUE} className="admin-link">
          View catalogue
        </Link>
        <button type="button" className="admin-link" onClick={logout}>
          Log out
        </button>
      </header>

      <div className="admin-body">
        <aside className="admin-list" aria-label="Pieces">
          <div className="admin-list-head">
            <h1>Pieces</h1>
            <span className="admin-count">{products?.length ?? '–'}</span>
            <button
              type="button"
              className="admin-button admin-primary"
              onClick={() => select(NEW)}
            >
              + New piece
            </button>
          </div>
          <input
            type="search"
            className="admin-search"
            placeholder="Search by name, category, year…"
            aria-label="Search pieces"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          {loadError ? (
            <p className="admin-error">{loadError}</p>
          ) : !products ? (
            <p className="admin-empty">Loading…</p>
          ) : visible.length === 0 ? (
            <p className="admin-empty">No pieces match “{query}”.</p>
          ) : (
            <ul className="admin-items">
              {visible.map((product) => (
                <li key={product.id}>
                  <button
                    type="button"
                    className={`admin-item${product.id === selectedId ? ' is-active' : ''}`}
                    aria-current={product.id === selectedId || undefined}
                    onClick={() => select(product.id)}
                  >
                    <img src={product.img} alt="" loading="lazy" />
                    <span className="admin-item-number">{product.number}</span>
                    <span className="admin-item-text">
                      <span className="admin-item-name">{product.name.en}</span>
                      <span className="admin-item-meta">
                        {product.category.en} · {product.year}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <main className="admin-editor">
          {editing && products ? (
            <>
              <button type="button" className="admin-link admin-back" onClick={() => select(null)}>
                ← All pieces
              </button>
              <ProductForm
                key={selectedId}
                product={selected}
                products={products}
                onSave={save}
                onDelete={remove}
                onClose={() => select(null)}
                onDirtyChange={setDirty}
              />
            </>
          ) : (
            <div className="admin-placeholder">
              <p className="admin-eyebrow">Catalogue</p>
              <h2>Choose a piece to edit, or add a new one.</h2>
              <p>Changes are saved to the catalogue database.</p>
            </div>
          )}
        </main>
      </div>

      {notice && (
        <p className="admin-notice" role="status">
          {notice}
        </p>
      )}
    </div>
  )
}
