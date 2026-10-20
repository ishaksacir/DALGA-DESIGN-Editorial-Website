/**
 * Latest Instagram posts written by `scripts/fetch-instagram.js`. Resolves to an empty
 * array when the feed has not been generated, so callers can fall back to `src/data/news.js`.
 */
export async function loadInstagramFeed() {
  try {
    const response = await fetch('/instagram/feed.json')
    if (!response.ok) return []
    const posts = await response.json()
    return Array.isArray(posts) ? posts : []
  } catch {
    return []
  }
}
