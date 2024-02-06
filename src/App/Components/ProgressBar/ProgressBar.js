
import styles from './ProgressBar.module.scss'
function ProgressBar({className, current, total}) {
  return <div className={[styles.container, className].join(' ')}>
    <div className={styles.bar} style={{width: (current / total * 100) + '%'}}></div>
  </div>
}

export default ProgressBar
