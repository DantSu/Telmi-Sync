import { useLocale } from '../../../Locale/LocaleHooks.js'

import styles from './ModalTasksVisualizer.module.scss'

import Loader1 from '../../../../Assets/Images/loader-1.svg'

function TaskWaiting ({task}) {
  const {getLocale} = useLocale()

  return <li className={styles.waitingTaskContainer}>
    <div className={styles.taskTextes}>
      <h2 className={styles.taskTitle}>{getLocale(task) + '\u200e'}</h2>
      <p className={styles.taskDescription}>{getLocale('waiting')}...</p>
    </div>
    <div className={styles.taskIcon}>
      <img className={styles.taskIconImg} src={Loader1} alt=""/>
    </div>
  </li>
}

export default TaskWaiting
