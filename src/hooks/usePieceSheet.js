import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { getProductById } from '@/data/products'

const PARAM = 'piece'

/**
 * The phone piece sheet lives in the URL as `?piece=<id>` on whatever page opened it, so Back
 * closes it and a piece can be linked to. Opening pushes a history entry; stepping to another
 * piece replaces it; closing goes back when we opened it, or drops the param otherwise.
 */
export function usePieceSheet() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = new URLSearchParams(location.search)
  const product = getProductById(params.get(PARAM)) || null

  const withPiece = useCallback(
    (id) => {
      const next = new URLSearchParams(location.search)
      if (id) next.set(PARAM, id)
      else next.delete(PARAM)
      const search = next.toString()
      return { pathname: location.pathname, search: search ? `?${search}` : '' }
    },
    [location.pathname, location.search],
  )

  const openPiece = useCallback(
    (id) => navigate(withPiece(id), { preventScrollReset: true, state: { sheet: true } }),
    [navigate, withPiece],
  )
  const stepTo = useCallback(
    (id) =>
      navigate(withPiece(id), {
        replace: true,
        preventScrollReset: true,
        state: location.state,
      }),
    [navigate, withPiece, location.state],
  )
  const closePiece = useCallback(() => {
    if (location.state?.sheet) navigate(-1)
    else navigate(withPiece(null), { replace: true, preventScrollReset: true })
  }, [navigate, withPiece, location.state])

  return { product, openPiece, stepTo, closePiece, pieceHref: (id) => withPiece(id) }
}
