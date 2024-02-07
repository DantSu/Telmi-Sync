import { useCallback, useState } from 'react'
import LocaleContext from './LocaleContext.js'
import * as locales from '../../../Locales/Locales.js'
import { printf } from '../../Helpers/String.js'

function LocaleProvider ({children}) {
  const
    [lang, setLang] = useState('fr'),
    getLocale = useCallback(
      (string, ...args) => (locales[lang] !== undefined && locales[lang][string]) ? printf(locales[lang][string], ...args) : string,
      [lang]
    )

  return <LocaleContext.Provider value={{lang, setLang, getLocale}}>{children}</LocaleContext.Provider>
}

export default LocaleProvider
