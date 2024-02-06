import ModalLayout from './ModalLayout.js'

import styles from './Modal.module.scss'
function ModalLayoutPadded ({className, ...props}) {
  return <ModalLayout {...props} className={[className, styles.modalPadding].join(' ')} />
}

export default ModalLayoutPadded
