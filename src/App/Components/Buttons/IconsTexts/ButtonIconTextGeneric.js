
import styles from './ButtonIconText.module.scss'

function ButtonIconGeneric({rounded, icon, text, className, ...props}) {
  return <button {...props} className={[className, styles.button, rounded ? styles.buttonRounded : ''].join(' ')}>
    <span className={styles.icon}>{icon}</span>
    {text}
  </button>
}

export default ButtonIconGeneric
