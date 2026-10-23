import { randomBytes } from 'node:crypto'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

import { Router } from 'express'
import multer from 'multer'

import { requireAdmin } from './auth.js'

/**
 * Product photos uploaded from the admin, saved to UPLOAD_DIR and served at /uploads.
 * On a host whose disk is wiped on deploy, point UPLOAD_DIR at a persistent volume.
 */
export const UPLOAD_DIR = resolve(process.env.UPLOAD_DIR ?? 'server/uploads')
mkdirSync(UPLOAD_DIR, { recursive: true })

const EXTENSIONS = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
}

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    // Random names: nothing from the visitor's file name reaches the disk.
    filename: (_request, file, done) =>
      done(null, `${randomBytes(12).toString('hex')}.${EXTENSIONS[file.mimetype]}`),
  }),
  limits: { fileSize: 15 * 1024 * 1024, files: 1 },
  fileFilter: (_request, file, done) => done(null, file.mimetype in EXTENSIONS),
})

export const uploadsRouter = Router()

uploadsRouter.post('/', requireAdmin, upload.single('image'), (request, response) => {
  if (!request.file) {
    return response.status(400).json({ error: 'Send a JPEG, PNG, WebP or AVIF image.' })
  }
  response.status(201).json({ url: `/uploads/${request.file.filename}` })
})
