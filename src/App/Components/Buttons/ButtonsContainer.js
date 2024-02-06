import styles from './ButtonsContainter.module.scss'

function ButtonsContainer ({children}) {
  return <div className={styles.container}>{
    children
  }</div>
}

export default ButtonsContainer
