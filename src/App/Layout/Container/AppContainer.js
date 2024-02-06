import styles from './AppContainer.module.scss'

function AppContainer({children}) {
  return <div className={styles.container}>{children}</div>
}

export default AppContainer
