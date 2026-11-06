import pg from 'pg'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.')
}

/** Shared connection pool. Hosted databases (Neon, Railway, Render…) need `?sslmode=require` in the URL. */
export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
