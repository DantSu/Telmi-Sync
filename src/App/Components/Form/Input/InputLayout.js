import { useLocale } from '../../Locale/LocaleHooks.js'

import styles from './Input.module.scss'

function InputLayout ({label, id, required, children}) {
  const {getLocale} = useLocale()
  return <div className={styles.container}>
    <label className={styles.label} htmlFor={id}>
      {getLocale(label)}
      {required && ' *'}
    </label>
    {children}
  </div>
}

export default InputLayout
