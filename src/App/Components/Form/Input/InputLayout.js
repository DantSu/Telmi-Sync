import {useLocale} from '../../Locale/LocaleHooks.js'

import styles from './Input.module.scss'

function InputLayout({label, id, required, className, vertical, children}) {
  const {getLocale} = useLocale()
  return <div className={[vertical ? styles.containerVertical : styles.container, className].join(' ')}>
    {
      label &&
      <label className={styles.label} htmlFor={id}>
        {getLocale(label)}
        {required && ' *'}
      </label>
    }
    {children}
  </div>
}

export default InputLayout
