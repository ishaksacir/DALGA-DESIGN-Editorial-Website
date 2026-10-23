import { registerHooks } from 'node:module'

import { createProduct } from '../products/repository.js'
import { pool } from './pool.js'

/**
 * Copies the pieces from `src/data/products.js` into the database, overwriting rows with the same id.
 * Pieces added in the admin are left alone. Run after `db:migrate`.
 */

// The site's data files import with Vite's `@/` alias; point it at src/ so Node can load them too.
const SRC = new URL('../../src/', import.meta.url)
registerHooks({
  resolve: (specifier, context, nextResolve) =>
    specifier.startsWith('@/')
      ? nextResolve(new URL(`${specifier.slice(2)}.js`, SRC).href, context)
      : nextResolve(specifier, context),
})

const { products } = await import('../../src/data/products.js')

const client = await pool.connect()
try {
  await client.query('BEGIN')
  for (const product of products) await createProduct(product, { upsert: true, client })
  await client.query('COMMIT')
  console.log(`Seeded ${products.length} pieces.`)
} catch (error) {
  await client.query('ROLLBACK')
  throw error
} finally {
  client.release()
  await pool.end()
}
