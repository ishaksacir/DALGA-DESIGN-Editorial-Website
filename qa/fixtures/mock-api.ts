import { readFileSync } from 'node:fs'
import type { BrowserContext, Route, Request } from '@playwright/test'

export const BASE_URL = process.env.QA_BASE_URL ?? 'http://localhost:5173'
export const LIVE_API = process.env.QA_LIVE_API === '1'

export interface Product {
  id: string
  number: string
  name: { bs: string; en: string }
  category: { bs: string; en: string }
  collection: { bs: string; en: string }
  year: string
  img: string
  images?: string[]
  alt: { bs: string; en: string }
  specs: [{ bs: string; en: string }, { bs: string; en: string }][]
  care?: { bs: string; en: string }[]
}

export const products: Product[] = JSON.parse(
  readFileSync(new URL('./products.json', import.meta.url), 'utf8'),
)

export type Endpoint = 'products' | 'product' | 'session' | 'login' | 'logout' | 'emailjs' | 'write'

export interface MockOptions {
  products?: Product[]
  fail?: Partial<Record<Endpoint, { status: number; body?: unknown } | 'abort'>>
  delayMs?: Partial<Record<Endpoint, number>>
}

export interface RecordedCall {
  method: string
  url: string
  body?: unknown
  endpoint: Endpoint | 'unmocked'
}

const PLACEHOLDER = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="#9a8f86"/></svg>`

const json = (route: Route, status: number, body: unknown) =>
  route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) })

/**
 * Answers every request the site makes outside its own static files:
 * - /api/* (catalogue + admin): products from fixtures/products.json; every write is refused and recorded.
 * - api.emailjs.com: the "Get your piece" form. Never reaches EmailJS, so no email is ever sent.
 * - Other hosts (Google Fonts, Instagram/Facebook links): stubbed or blocked.
 */
export class MockApi {
  calls: RecordedCall[] = []
  externalBlocked: string[] = []
  private opts: MockOptions = {}

  set(opts: MockOptions) {
    this.opts = {
      ...this.opts,
      ...opts,
      fail: { ...this.opts.fail, ...opts.fail },
      delayMs: { ...this.opts.delayMs, ...opts.delayMs },
    }
  }

  callsTo(endpoint: Endpoint) {
    return this.calls.filter((c) => c.endpoint === endpoint)
  }

  get emails() {
    return this.callsTo('emailjs').map(
      (c) =>
        c.body as {
          template_params: { subject: string; html: string; name: string; to_email: string }
        },
    )
  }

  async install(context: BrowserContext) {
    await context.route('**/*', (route, request) => this.handle(route, request))
  }

  private record(request: Request, endpoint: RecordedCall['endpoint']) {
    let body: unknown
    try {
      body = request.postDataJSON()
    } catch {
      body = request.postData()
    }
    this.calls.push({ method: request.method(), url: request.url(), body, endpoint })
  }

  private async gate(endpoint: Endpoint, route: Route) {
    const delay = this.opts.delayMs?.[endpoint]
    if (delay) await new Promise((r) => setTimeout(r, delay))
    const fail = this.opts.fail?.[endpoint]
    if (fail === 'abort') {
      await route.abort('failed')
      return true
    }
    if (fail) {
      await json(route, fail.status, fail.body ?? { error: 'QA forced failure' })
      return true
    }
    return false
  }

  private async handle(route: Route, request: Request) {
    const url = new URL(request.url())
    const base = new URL(BASE_URL)
    const method = request.method()

    if (url.hostname === 'api.emailjs.com') {
      this.record(request, 'emailjs')
      if (await this.gate('emailjs', route)) return
      return route.fulfill({ status: 200, contentType: 'text/plain', body: 'OK' })
    }

    if (url.origin !== base.origin) {
      this.externalBlocked.push(request.url())
      const type = request.resourceType()
      if (type === 'image')
        return route.fulfill({ status: 200, contentType: 'image/svg+xml', body: PLACEHOLDER })
      if (type === 'stylesheet')
        return route.fulfill({ status: 200, contentType: 'text/css', body: '' })
      if (type === 'document')
        return route.fulfill({
          status: 200,
          contentType: 'text/html',
          body: `<!doctype html><title>External stub</title><h1 data-qa="external">${url.href.replace(/</g, '&lt;')}</h1>`,
        })
      return route.abort('blockedbyclient')
    }

    if (url.pathname.startsWith('/uploads/'))
      return route.fulfill({ status: 200, contentType: 'image/svg+xml', body: PLACEHOLDER })
    if (!url.pathname.startsWith('/api/')) return route.continue()

    const p = url.pathname.replace(/^\/api/, '').replace(/\/$/, '')
    let endpoint: Endpoint | null = null
    if (method === 'GET' && p === '/products') endpoint = 'products'
    else if (method === 'GET' && /^\/products\/[^/]+$/.test(p)) endpoint = 'product'
    else if (method === 'GET' && p === '/admin/session') endpoint = 'session'
    else if (method === 'POST' && p === '/admin/login') endpoint = 'login'
    else if (method === 'POST' && p === '/admin/logout') endpoint = 'logout'
    else if (method !== 'GET') endpoint = 'write'

    this.record(request, endpoint ?? 'unmocked')
    if (LIVE_API && method === 'GET' && endpoint && !this.opts.fail?.[endpoint])
      return route.continue()
    if (!endpoint) return json(route, 404, { error: `QA: GET ${url.pathname} is not mocked` })
    if (await this.gate(endpoint, route)) return

    const list = this.opts.products ?? products
    switch (endpoint) {
      case 'products':
        return json(route, 200, list)
      case 'product': {
        const found = list.find((x) => x.id === decodeURIComponent(p.split('/')[2]))
        return found
          ? json(route, 200, found)
          : json(route, 404, { error: 'No piece with this id.' })
      }
      case 'session':
        return json(route, 200, { admin: false })
      case 'login':
        return json(route, 401, { error: 'Wrong password.' })
      case 'logout':
        return json(route, 200, { admin: false })
      case 'write':
        return json(route, 401, { error: 'Log in to continue.' })
    }
  }
}
