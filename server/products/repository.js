import { pool } from '../db/pool.js'

const COLUMNS = `id, number, year, name, category, collection, images, alt, intro, description,
  composition, creation, specs, care`

// Numbers are zero-padded text ("01"); sorting by length first keeps "100" after "99".
const ORDER = 'ORDER BY length(number), number'

/** Row → the product shape the site already reads (`img` cover, `images` only for a gallery). */
const toProduct = (row) => {
  const product = {
    id: row.id,
    number: row.number,
    name: row.name,
    category: row.category,
    collection: row.collection,
    year: String(row.year),
    img: row.images[0],
    alt: row.alt,
    intro: row.intro,
    description: row.description,
    composition: row.composition,
    specs: row.specs,
  }
  if (row.images.length > 1) product.images = row.images
  if (row.care.length) product.care = row.care
  if (row.creation) product.creation = row.creation
  return product
}

/** Product → query values, in COLUMNS order. */
const toValues = (product) => [
  product.id,
  product.number,
  Number(product.year),
  product.name,
  product.category,
  product.collection,
  product.images?.length ? product.images : [product.img],
  product.alt,
  product.intro,
  product.description,
  product.composition,
  product.creation ?? null,
  JSON.stringify(product.specs ?? []),
  JSON.stringify(product.care ?? []),
]

export async function listProducts() {
  const { rows } = await pool.query(`SELECT ${COLUMNS} FROM products ${ORDER}`)
  return rows.map(toProduct)
}

export async function getProduct(id) {
  const { rows } = await pool.query(`SELECT ${COLUMNS} FROM products WHERE id = $1`, [id])
  return rows[0] ? toProduct(rows[0]) : null
}

/** Inserts the piece, or overwrites it when `upsert` is set (used by the seed script). */
export async function createProduct(product, { upsert = false, client = pool } = {}) {
  const conflict = upsert
    ? `ON CONFLICT (id) DO UPDATE SET ${COLUMNS.split(',')
        .slice(1)
        .map((column) => `${column.trim()} = EXCLUDED.${column.trim()}`)
        .join(', ')}, updated_at = now()`
    : ''
  const { rows } = await client.query(
    `INSERT INTO products (${COLUMNS})
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
     ${conflict}
     RETURNING ${COLUMNS}`,
    toValues(product),
  )
  return toProduct(rows[0])
}

/** Replaces the piece stored as `previousId`; the id itself may change. Returns null if it is gone. */
export async function updateProduct(previousId, product) {
  const { rows } = await pool.query(
    `UPDATE products SET
       id = $1, number = $2, year = $3, name = $4, category = $5, collection = $6, images = $7,
       alt = $8, intro = $9, description = $10, composition = $11, creation = $12, specs = $13,
       care = $14, updated_at = now()
     WHERE id = $15
     RETURNING ${COLUMNS}`,
    [...toValues(product), previousId],
  )
  return rows[0] ? toProduct(rows[0]) : null
}

export async function deleteProduct(id) {
  const { rowCount } = await pool.query('DELETE FROM products WHERE id = $1', [id])
  return rowCount > 0
}
