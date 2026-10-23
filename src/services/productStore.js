/**
 * Client for the catalogue API in `server/` (Postgres), used by the site and the admin. Admin calls send the login cookie;
 * failures throw an ApiError carrying the server's message and, for invalid pieces, per-field errors.
 */
export class ApiError extends Error {
  constructor(message, status, fields = {}) {
    super(message)
    this.status = status
    this.fields = fields
  }
}

async function request(path, { body, ...options } = {}) {
  const isForm = body instanceof FormData
  let response
  try {
    response = await fetch(`/api${path}`, {
      ...options,
      credentials: 'same-origin',
      headers: body && !isForm ? { 'Content-Type': 'application/json' } : undefined,
      body: body && !isForm ? JSON.stringify(body) : body,
    })
  } catch {
    throw new ApiError('Cannot reach the server. Check that it is running.', 0)
  }
  if (response.status === 204) return null
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new ApiError(
      data.error ?? `Request failed (${response.status}).`,
      response.status,
      data.fields,
    )
  }
  return data
}

export const listProducts = () => request('/products')

/** Creates the piece, or updates the one saved as `previousId` (which differs when the id was renamed). */
export const saveProduct = (product, previousId) =>
  previousId
    ? request(`/products/${encodeURIComponent(previousId)}`, { method: 'PUT', body: product })
    : request('/products', { method: 'POST', body: product })

export const deleteProduct = (id) =>
  request(`/products/${encodeURIComponent(id)}`, { method: 'DELETE' })

/** Uploads one photo and resolves to its public URL. */
export async function uploadImage(file) {
  const body = new FormData()
  body.append('image', file)
  const { url } = await request('/uploads', { method: 'POST', body })
  return url
}

export const getSession = () => request('/admin/session').then(({ admin }) => admin)

export const logIn = (password) =>
  request('/admin/login', { method: 'POST', body: { password } }).then(({ admin }) => admin)

export const logOut = () => request('/admin/logout', { method: 'POST' })
