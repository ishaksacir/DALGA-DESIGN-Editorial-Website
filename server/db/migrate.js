import { readFile } from 'node:fs/promises'

import { pool } from './pool.js'

/** Creates the tables. `schema.sql` only uses IF NOT EXISTS, so running it again changes nothing. */
const schema = await readFile(new URL('./schema.sql', import.meta.url), 'utf8')
await pool.query(schema)
await pool.end()
console.log('Database schema is up to date.')
