import { createBrowserRouter } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { loadProducts, SITE_ROUTE_ID } from '@/hooks/useProducts'
import { AppLayout } from '@/layouts/AppLayout'
import { HomePage } from '@/pages/Home/HomePage'
import { LoadErrorPage } from '@/pages/LoadError/LoadErrorPage'

/**
 * Loads a page's code only when its route is first visited, so the home page doesn't download the rest.
 * The home page stays in the main bundle since most visits start there.
 */
const page = (load, name) => () => load().then((module) => ({ Component: module[name] }))

export const router = createBrowserRouter([
  {
    id: SITE_ROUTE_ID,
    element: <AppLayout />,
    // Every page reads the catalogue from the database, so it loads before the first render.
    loader: loadProducts,
    // Once per visit: filters and the piece sheet change the URL's search params, which would refetch it.
    shouldRevalidate: () => false,
    errorElement: <LoadErrorPage />,
    // Shown for the moment a lazily loaded page is fetched on a direct visit; it is too brief to dress up.
    HydrateFallback: () => null,
    children: [
      { path: ROUTES.HOME, element: <HomePage /> },
      {
        path: ROUTES.CATALOGUE,
        lazy: page(() => import('@/pages/Catalogue/CataloguePage'), 'CataloguePage'),
      },
      {
        path: ROUTES.PRODUCT,
        lazy: page(() => import('@/pages/Catalogue/ProductPage'), 'ProductPage'),
      },
      {
        path: ROUTES.ONE_OF_ONE,
        lazy: page(() => import('@/pages/OneOfOne/OneOfOnePage'), 'OneOfOnePage'),
      },
      { path: ROUTES.ABOUT, lazy: page(() => import('@/pages/About/AboutPage'), 'AboutPage') },
      {
        path: '*',
        lazy: page(() => import('@/pages/NotFound/NotFoundPage'), 'NotFoundPage'),
      },
    ],
  },
  // The admin sits outside the site layout: no navigation, footer or reveal animations.
  {
    path: ROUTES.ADMIN,
    HydrateFallback: () => null,
    lazy: page(() => import('@/pages/Admin/AdminPage'), 'AdminPage'),
  },
])
