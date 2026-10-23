import { Router } from 'express'

import { requireAdmin } from '../auth.js'
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from './repository.js'
import { validateProduct } from './validate.js'

// Postgres error code for a duplicate primary key.
const UNIQUE_VIOLATION = '23505'

const rejectInvalid = (request, response, next) => {
  const fields = validateProduct(request.body)
  if (Object.keys(fields).length) {
    return response.status(400).json({ error: 'Some fields need attention.', fields })
  }
  next()
}

const idTaken = (response) =>
  response.status(409).json({
    error: 'Another piece already uses this id.',
    fields: { id: 'Another piece already uses this id.' },
  })

export const productsRouter = Router()

productsRouter.get('/', async (_request, response) => {
  response.json(await listProducts())
})

productsRouter.get('/:id', async (request, response) => {
  const product = await getProduct(request.params.id)
  if (!product) return response.status(404).json({ error: 'No piece with this id.' })
  response.json(product)
})

productsRouter.post('/', requireAdmin, rejectInvalid, async (request, response) => {
  try {
    response.status(201).json(await createProduct(request.body))
  } catch (error) {
    if (error.code === UNIQUE_VIOLATION) return idTaken(response)
    throw error
  }
})

productsRouter.put('/:id', requireAdmin, rejectInvalid, async (request, response) => {
  try {
    const product = await updateProduct(request.params.id, request.body)
    if (!product) return response.status(404).json({ error: 'This piece no longer exists.' })
    response.json(product)
  } catch (error) {
    if (error.code === UNIQUE_VIOLATION) return idTaken(response)
    throw error
  }
})

productsRouter.delete('/:id', requireAdmin, async (request, response) => {
  if (!(await deleteProduct(request.params.id))) {
    return response.status(404).json({ error: 'No piece with this id.' })
  }
  response.status(204).end()
})
