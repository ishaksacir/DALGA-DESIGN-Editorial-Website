export const ROUTES = {
  HOME: '/',
  CATALOGUE: '/catalogue',
  PRODUCT: '/catalogue/:productId',
  ONE_OF_ONE: '/one-of-one',
  ABOUT: '/about',
  ADMIN: '/admin',
}

export const productPath = (productId) => `/catalogue/${productId}`
