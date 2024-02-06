import { forwardRef } from 'react'

import styles from './Input.module.scss'
function InputText({label, id, required, children}, ref) {
  return <div className={styles.container}>
    <label className={styles.label} htmlFor={id}>
      {label}
      {required && ' *'}
    </label>
    {children}
  </div>
}

export default forwardRef(InputText)
