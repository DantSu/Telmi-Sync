
import styles from './FormMessage.module.scss'

function FormMessageWarning({children}) {
  return <p className={[styles.message, styles.warning].join(' ')}><i className={styles.icon}>{'\uf071'}</i>{children}</p>
}

export default FormMessageWarning