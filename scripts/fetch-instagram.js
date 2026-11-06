// Pulls the newest @dalga.design posts into public/instagram/ for the home "New at the atelier" section:
// `npm run instagram` (also runs before every `npm run build`).
// Needs INSTAGRAM_ACCESS_TOKEN (Instagram API with Instagram Login) in .env.local or the environment.
// Images are downloaded because Instagram's media URLs expire after a few days, and saved as WebP
// (at most 1200 px on the long side) so they weigh a fraction of Instagram's JPEGs.
// Never fails the build: without a token or on an API error the existing feed is left as is,
// and the site falls back to src/data/news.js when there is no feed at all.
import { Buffer } from 'node:buffer'
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'

import sharp from 'sharp'

const POST_COUNT = 4
const OUT_DIR = 'public/instagram'
const API = 'https://graph.instagram.com'
const IMAGE_SIZE = 1200
const IMAGE_QUALITY = 80

const token = process.env.INSTAGRAM_ACCESS_TOKEN

/** First line (or sentence) becomes the title, the rest the excerpt; hashtags and mentions are dropped. */
function splitCaption(caption = '') {
  const text = caption
    .replace(/(^|\s)[#@][\p{L}\p{N}_.]+/gu, '')
    .replace(/[ \t]+/g, ' ')
    .trim()
  const lines = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
  let title = lines[0] ?? ''
  let rest = lines.slice(1).join(' ')

  const sentenceEnd = title.search(/[.!?](\s|$)/)
  if (sentenceEnd > 0 && sentenceEnd < title.length - 1) {
    rest = `${title.slice(sentenceEnd + 1).trim()} ${rest}`.trim()
    title = title.slice(0, sentenceEnd + 1)
  }

  return { title: truncate(title, 90), excerpt: truncate(rest, 180) }
}

function truncate(text, max) {
  if (text.length <= max) return text
  return `${text.slice(0, text.lastIndexOf(' ', max)).replace(/[,;:.]$/, '')}…`
}

async function getJson(url) {
  const response = await fetch(url)
  const body = await response.json()
  if (!response.ok) throw new Error(body.error?.message ?? `HTTP ${response.status}`)
  return body
}

async function download(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Image download failed: HTTP ${response.status}`)
  return Buffer.from(await response.arrayBuffer())
}

/** Instagram serves full-size JPEGs; the site never shows them wider than IMAGE_SIZE. */
function toWebp(buffer) {
  return sharp(buffer)
    .rotate()
    .resize(IMAGE_SIZE, IMAGE_SIZE, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: IMAGE_QUALITY })
    .toBuffer()
}

async function main() {
  if (!token) {
    console.log('[instagram] INSTAGRAM_ACCESS_TOKEN not set — skipping, existing feed kept.')
    return
  }

  const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp'
  const { data } = await getJson(
    `${API}/me/media?fields=${fields}&limit=${POST_COUNT}&access_token=${token}`,
  )

  // Download everything first so a failure halfway leaves the previous feed intact.
  const images = new Map()
  const posts = []
  for (const post of data) {
    const imageUrl = post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url
    if (!imageUrl) continue
    const fileName = `${post.id}.webp`
    images.set(fileName, await toWebp(await download(imageUrl)))
    posts.push({
      id: post.id,
      href: post.permalink,
      date: post.timestamp,
      img: `/instagram/${fileName}`,
      ...splitCaption(post.caption),
    })
  }

  mkdirSync(OUT_DIR, { recursive: true })
  for (const file of readdirSync(OUT_DIR)) rmSync(join(OUT_DIR, file))
  for (const [fileName, buffer] of images) writeFileSync(join(OUT_DIR, fileName), buffer)
  writeFileSync(join(OUT_DIR, 'feed.json'), `${JSON.stringify(posts, null, 2)}\n`)
  console.log(`[instagram] Saved ${posts.length} posts to ${OUT_DIR}/feed.json`)

  // Long-lived tokens expire after 60 days unless refreshed; each run refreshes it.
  const refreshed = await getJson(
    `${API}/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`,
  ).catch(() => null)
  if (refreshed?.expires_in) {
    const days = Math.round(refreshed.expires_in / 86400)
    console.log(`[instagram] Token refreshed, valid for ${days} more days.`)
  }
}

main().catch((error) => {
  console.warn(`[instagram] Could not update feed: ${error.message}`)
})
