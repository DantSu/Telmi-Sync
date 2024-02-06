
import styles from './ButtonIcon.module.scss'

function ButtonIconGeneric(props) {
  return <button {...props} className={[props.className, styles.button].join(' ')}>{props.icon}</button>
}

export default ButtonIconGeneric
