
import styles from './Modal.module.scss'
function ModalTitle({className, children}) {
  return <h2 className={[className, styles.title].join(' ')}>{children}</h2>
}

export default ModalTitle
