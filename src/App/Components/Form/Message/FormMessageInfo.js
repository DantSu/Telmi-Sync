
import styles from './FormMessage.module.scss'

function FormMessageInfo({children}) {
  return <p className={[styles.message, styles.info].join(' ')}><i className={styles.icon}>{'\uf05a'}</i>{children}</p>
}

export default FormMessageInfo