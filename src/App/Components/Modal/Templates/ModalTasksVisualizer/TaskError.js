import styles from './ModalTasksVisualizer.module.scss'
import { useLocale } from '../../../Locale/LocaleHooks.js'

function TaskError ({task, message}) {
  const {getLocale} = useLocale()
  return <li className={styles.waitingTaskContainer}>
    <div className={styles.taskTextes}>
      <h2 className={styles.taskTitle}>{getLocale(task) + '\u200e'}</h2>
      <p className={styles.taskDescription}>{getLocale(message)}.</p>
    </div>
    <div className={styles.taskIcon}>{'\uf071'}</div>
  </li>
}

export default TaskError
