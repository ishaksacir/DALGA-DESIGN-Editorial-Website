import { useCallback, useEffect, useMemo, useState } from 'react'
import { DEFAULT_LANGUAGE, LanguageContext, LANGUAGES, dictionaries } from './context'

const STORAGE_KEY = 'dalga-language'

const readStoredLanguage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return LANGUAGES.includes(stored) ? stored : DEFAULT_LANGUAGE
  } catch {
    return DEFAULT_LANGUAGE
  }
}

/** Holds the active language (Bosnian by default) and remembers the visitor's choice. */
export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(readStoredLanguage)

  const setLang = useCallback((next) => {
    if (!LANGUAGES.includes(next)) return
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Storage can be unavailable (private mode); the choice then lasts for this visit only.
    }
  }, [])

  const t = dictionaries[lang]

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = t.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)
  }, [lang, t])

  /** Picks the active language from a `{ bs, en }` field; plain values pass through untouched. */
  const tr = useCallback(
    (value) => (value && typeof value === 'object' && lang in value ? value[lang] : value),
    [lang],
  )

  const value = useMemo(() => ({ lang, setLang, t, tr }), [lang, setLang, t, tr])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
