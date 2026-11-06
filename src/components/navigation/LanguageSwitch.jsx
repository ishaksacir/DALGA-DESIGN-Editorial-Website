import { useI18n, LANGUAGES } from '@/i18n/context'

/** BS / EN toggle in the nav. Each label is shown in its own language. */
export function LanguageSwitch() {
  const { lang, setLang, t } = useI18n()

  return (
    <div className="lang-switch" role="group" aria-label={t.language.label}>
      {LANGUAGES.map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          aria-pressed={lang === code}
          className={lang === code ? 'active' : ''}
          onClick={() => setLang(code)}
        >
          {code}
        </button>
      ))}
    </div>
  )
}
