import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

import express from 'express'

import { authRouter } from './auth.js'
import { productsRouter } from './products/routes.js'
import { UPLOAD_DIR, uploadsRouter } from './uploads.js'

/**
 * Catalogue API. In development Vite proxies /api and /uploads here (see vite.config.js);
 * in production (`npm start`) this one process also serves the built site from dist/.
 */
const PORT = Number(process.env.PORT ?? 3001)
const DIST = resolve('dist')

const app = express()
app.disable('x-powered-by')
// Behind a host's proxy, use the visitor's address (for login throttling) and honour HTTPS.
app.set('trust proxy', 1)
app.use(express.json({ limit: '200kb' }))

app.use('/api/admin', authRouter)
app.use('/api/products', productsRouter)
app.use('/api/uploads', uploadsRouter)
app.use('/api', (_request, response) => response.status(404).json({ error: 'Not found.' }))

app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '30d', immutable: true }))

if (process.env.NODE_ENV === 'production' && existsSync(DIST)) {
  app.use(express.static(DIST, { index: false }))
  // Every other path is a page route; the React router takes it from there.
  app.get('/{*path}', (_request, response) => response.sendFile(resolve(DIST, 'index.html')))
}

// Express 5 forwards rejected promises here; the details stay in the server log.
app.use((error, _request, response, _next) => {
  console.error(error)
  if (error.type === 'entity.parse.failed') {
    return response.status(400).json({ error: 'The request body is not valid JSON.' })
  }
  if (error.name === 'MulterError') {
    const tooLarge = error.code === 'LIMIT_FILE_SIZE'
    return response
      .status(tooLarge ? 413 : 400)
      .json({ error: tooLarge ? 'Images must be under 15 MB.' : 'Upload one image at a time.' })
  }
  response.status(error.status ?? 500).json({ error: 'Something went wrong on the server.' })
})

app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`))
