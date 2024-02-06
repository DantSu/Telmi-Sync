
import styles from './Modal.module.scss'
function ModalTitle({children}) {
  return <h2 className={styles.title}>{children}</h2>
}

export default ModalTitle
