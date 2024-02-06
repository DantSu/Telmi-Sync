import ButtonIconXMark from '../Buttons/Icons/ButtonIconXMark.js'

import styles from './Modal.module.scss'
function ModalLayout ({className, children, isClosable, onClose}) {
  return <div className={styles.container}>
    <div className={styles.modal}>
      <div className={[styles.modalOverflow, className].join(' ')}>{children}</div>
      {isClosable && <ButtonIconXMark className={styles.buttonClose} onClick={onClose}/>}
    </div>
  </div>
}

export default ModalLayout
