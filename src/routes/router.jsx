import { createBrowserRouter } from 'react-router-dom'

import { ROUTES } from '@/constants/routes'
import { AppLayout } from '@/layouts/AppLayout'
import { AboutPage } from '@/pages/About/AboutPage'
import { CataloguePage } from '@/pages/Catalogue/CataloguePage'
import { ProductPage } from '@/pages/Catalogue/ProductPage'
import { HomePage } from '@/pages/Home/HomePage'
import { NotFoundPage } from '@/pages/NotFound/NotFoundPage'
import { OneOfOnePage } from '@/pages/OneOfOne/OneOfOnePage'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: ROUTES.HOME, element: <HomePage /> },
      { path: ROUTES.CATALOGUE, element: <CataloguePage /> },
      { path: ROUTES.PRODUCT, element: <ProductPage /> },
      { path: ROUTES.ONE_OF_ONE, element: <OneOfOnePage /> },
      { path: ROUTES.ABOUT, element: <AboutPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
