import { useRouteLoaderData } from 'react-router-dom'

import { listProducts } from '@/services/productStore'

/** Id of the site layout route, whose loader fetches the catalogue (see routes/router.jsx). */
export const SITE_ROUTE_ID = 'site'

/** Loads every piece from the catalogue API once per visit, before the first page renders. */
export const loadProducts = () => listProducts()

/** All catalogue pieces, in catalogue order. */
export const useProducts = () => useRouteLoaderData(SITE_ROUTE_ID)

/** One piece by id, or undefined. */
export function useProduct(id) {
  return useProducts().find((product) => product.id === id)
}
