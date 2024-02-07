import { useContext } from 'react'
import LocaleContext from './LocaleContext.js'

const useLocale = () => useContext(LocaleContext)

export { useLocale }
