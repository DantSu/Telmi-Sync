
import styles from './Modal.module.scss'
function ModalContent({children}) {
  return <div className={styles.modalContent}>{children}</div>
}

export default ModalContent
