// Builds fixtures/products.json from the site's seed catalogue (src/data/products.js), in the exact
// shape GET /api/products returns (server/products/repository.js → toProduct), so the mocked API
// serves what a freshly seeded database would.
import { writeFileSync } from 'node:fs'
import { registerHooks } from 'node:module'
import { fileURLToPath } from 'node:url'

const ROOT = new URL('../../', import.meta.url)
const SRC = new URL('src/', ROOT)

registerHooks({
  resolve: (specifier, context, nextResolve) =>
    specifier.startsWith('@/')
      ? nextResolve(new URL(`${specifier.slice(2)}.js`, SRC).href, context)
      : nextResolve(specifier, context),
})

const { products } = await import(new URL('data/products.js', SRC).href)

const toApi = (p) => {
  const images = p.images?.length ? p.images : [p.img]
  const product = {
    id: p.id,
    number: p.number,
    name: p.name,
    category: p.category,
    collection: p.collection,
    year: String(p.year),
    img: images[0],
    alt: p.alt,
    intro: p.intro,
    description: p.description,
    composition: p.composition,
    specs: p.specs ?? [],
  }
  if (images.length > 1) product.images = images
  if (p.care?.length) product.care = p.care
  if (p.creation) product.creation = p.creation
  return product
}

const target = fileURLToPath(new URL('../fixtures/products.json', import.meta.url))
writeFileSync(target, JSON.stringify(products.map(toApi), null, 2) + '\n')
console.log(`fixtures/products.json: ${products.length} pieces from src/data/products.js`)
