import { createHash, createHmac, timingSafeEqual } from 'node:crypto'

import { Router } from 'express'

/**
 * One shared admin password (ADMIN_PASSWORD). A successful login sets a signed, HttpOnly cookie
 * holding only its expiry, so there is no session table to keep.
 */
const COOKIE = 'dalga_admin'
const SESSION_DAYS = 7
const MAX_FAILURES = 10
const LOCKOUT_MS = 15 * 60 * 1000

const { ADMIN_PASSWORD, SESSION_SECRET } = process.env
if (!ADMIN_PASSWORD || !SESSION_SECRET || SESSION_SECRET.length < 32) {
  throw new Error(
    'Set ADMIN_PASSWORD and a SESSION_SECRET of at least 32 characters in .env.local.',
  )
}

const sign = (value) => createHmac('sha256', SESSION_SECRET).update(value).digest('base64url')
const digest = (value) => createHash('sha256').update(value).digest()
// Comparing hashes keeps the comparison constant-time whatever the password length.
const matches = (a, b) => timingSafeEqual(digest(a), digest(b))

const readToken = (request) =>
  request.headers.cookie
    ?.split(';')
    .map((part) => part.trim().split('='))
    .find(([name]) => name === COOKIE)?.[1]

const isValidToken = (token) => {
  const [expires, signature] = token?.split('.') ?? []
  return Boolean(signature) && matches(signature, sign(expires)) && Number(expires) > Date.now()
}

const cookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
}

export function requireAdmin(request, response, next) {
  if (isValidToken(readToken(request))) return next()
  response.status(401).json({ error: 'Log in to continue.' })
}

// Failed logins per address, so the password cannot be guessed by brute force.
const failures = new Map()

export const authRouter = Router()

authRouter.get('/session', (request, response) => {
  response.json({ admin: isValidToken(readToken(request)) })
})

authRouter.post('/login', (request, response) => {
  const now = Date.now()
  const record = failures.get(request.ip)
  if (record && record.count >= MAX_FAILURES && now - record.last < LOCKOUT_MS) {
    return response.status(429).json({ error: 'Too many attempts. Try again in 15 minutes.' })
  }

  const password = typeof request.body?.password === 'string' ? request.body.password : ''
  if (!matches(password, ADMIN_PASSWORD)) {
    failures.set(request.ip, { count: (record?.count ?? 0) + 1, last: now })
    return response.status(401).json({ error: 'Wrong password.' })
  }

  failures.delete(request.ip)
  const expires = String(now + SESSION_DAYS * 24 * 60 * 60 * 1000)
  response.cookie(COOKIE, `${expires}.${sign(expires)}`, {
    ...cookieOptions,
    maxAge: SESSION_DAYS * 24 * 60 * 60 * 1000,
  })
  response.json({ admin: true })
})

authRouter.post('/logout', (request, response) => {
  response.clearCookie(COOKIE, cookieOptions)
  response.json({ admin: false })
})
