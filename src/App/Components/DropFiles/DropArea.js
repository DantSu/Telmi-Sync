import { forwardRef } from 'react'

import styles from './DropFiles.module.scss'
import { useLocale } from '../Locale/LocaleHooks.js'

function DropArea({isOver}, ref) {
  const {getLocale} = useLocale()
  return <div ref={ref} className={isOver ? styles.container : styles.containerHidden}>
    <p className={styles.text}>{getLocale('drop-files')}</p>
  </div>
}

const ForwardRefDropArea = forwardRef(DropArea)

export default ForwardRefDropArea
