import { useCallback, useMemo, useReducer, useRef } from 'react'

import { ContactDrawer } from './ContactDrawer'
import { ContactDrawerContext } from './context'

const EMPTY_FORM = { name: '', surname: '', phone: '', message: '' }

/** `tags` maps a tagged product id to its change note. `status` is idle | sending | failed | sent. */
const initialState = { open: false, status: 'idle', tried: false, form: EMPTY_FORM, tags: {} }

function reducer(state, action) {
  switch (action.type) {
    case 'open': {
      const base = state.status === 'sent' ? initialState : state
      const tags =
        action.productId && !(action.productId in base.tags)
          ? { ...base.tags, [action.productId]: '' }
          : base.tags
      return { ...base, open: true, tags }
    }
    case 'close':
      // Unsent input is kept for the next open; a sent request starts fresh.
      return state.status === 'sent' ? initialState : { ...state, open: false }
    case 'field':
      return { ...state, form: { ...state.form, [action.field]: action.value } }
    case 'toggleTag': {
      const tags = { ...state.tags }
      if (action.productId in tags) delete tags[action.productId]
      else tags[action.productId] = ''
      return { ...state, tags }
    }
    case 'note':
      return { ...state, tags: { ...state.tags, [action.productId]: action.value } }
    case 'invalid':
      return { ...state, tried: true }
    case 'status':
      return { ...state, status: action.status }
    case 'reset':
      return { ...initialState, open: true }
    default:
      return state
  }
}

/** Owns the contact drawer's state and renders it once for the whole app. */
export function ContactDrawerProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const returnFocusRef = useRef(null)

  const openDrawer = useCallback((productId) => {
    returnFocusRef.current = document.activeElement
    dispatch({ type: 'open', productId })
  }, [])

  const value = useMemo(() => ({ openDrawer, isOpen: state.open }), [openDrawer, state.open])

  return (
    <ContactDrawerContext.Provider value={value}>
      {children}
      <ContactDrawer state={state} dispatch={dispatch} returnFocusRef={returnFocusRef} />
    </ContactDrawerContext.Provider>
  )
}
