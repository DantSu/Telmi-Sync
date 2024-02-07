import { createContext } from 'react'

const LocaleContext = createContext({
  lang: '',
  setLang: (lang) => {},
  getLocale: (string) => {}
})


export default LocaleContext
