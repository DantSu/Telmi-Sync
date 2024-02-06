import { forwardRef } from 'react'

import styles from './DropFiles.module.scss'

function DropArea({isOver}, ref) {
  return <div ref={ref} className={isOver ? styles.container : styles.containerHidden}>
    <p className={styles.text}>
      Déposez vos fichiers
    </p>
  </div>
}

const ForwardRefDropArea = forwardRef(DropArea)

export default ForwardRefDropArea
