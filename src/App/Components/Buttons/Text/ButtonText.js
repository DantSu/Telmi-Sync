
import styles from '../IconsTexts/ButtonIconText.module.scss'

function ButtonText({rounded, icon, text, className, ...props}) {
  return <button {...props} className={[className, styles.button, rounded ? styles.buttonRounded : ''].join(' ')}>
    {text}
  </button>
}

export default ButtonText
