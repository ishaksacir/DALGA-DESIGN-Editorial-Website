import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/layouts/AppLayout'
import { ROUTES } from '@/constants/routes'
import { HomePage } from '@/pages/Home/HomePage'
import { AboutPage } from '@/pages/About/AboutPage'
import { CataloguePage } from '@/pages/Catalogue/CataloguePage'
import { ProductPage } from '@/pages/Catalogue/ProductPage'
import { OneOfOnePage } from '@/pages/OneOfOne/OneOfOnePage'
import { NotFoundPage } from '@/pages/NotFound/NotFoundPage'

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
