
import styles from './ButtonIcon.module.scss'

function ButtonIconGeneric({rounded, ...props}) {
  return <button {...props} className={[rounded ? styles.buttonRounded : styles.button, props.className].join(' ')}>{props.icon}</button>
}

export default ButtonIconGeneric
