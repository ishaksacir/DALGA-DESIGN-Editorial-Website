import { createContext, useContext } from 'react'

import { bs } from './locales/bs'
import { en } from './locales/en'

export const dictionaries = { bs, en }
export const LANGUAGES = ['bs', 'en']
export const DEFAULT_LANGUAGE = 'bs'

export const LanguageContext = createContext(null)

/** `t` is the active dictionary, `tr` resolves `{ bs, en }` data fields, `setLang` switches language. */
export function useI18n() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useI18n must be used inside <LanguageProvider>')
  return context
}
