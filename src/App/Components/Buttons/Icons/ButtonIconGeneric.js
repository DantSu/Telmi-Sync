
import styles from './ButtonIcon.module.scss'

function ButtonIconGeneric(props) {
  return <button {...props} className={[styles.button, props.className].join(' ')}>{props.icon}</button>
}

export default ButtonIconGeneric
