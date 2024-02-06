import styles from './ModalTasksVisualizer.module.scss'
import ProgressBar from '../../../ProgressBar/ProgressBar.js'

import Loader2 from '../../../../Assets/Images/loader-2.svg'

function TaskProcessing ({task, message, current, total}) {
  return <li className={styles.taskContainer}>
    <div className={styles.taskTextes}>
      <h2 className={styles.taskTitle}>{task}</h2>
      <ProgressBar className={styles.taskProgressBar} current={current} total={total}/>
      <p className={styles.taskProgressDescription}>
        <span className={[styles.taskDescription, styles.taskDescriptionEllipsis].join(' ')}>Traitement de {message}</span>
        <span className={styles.taskProgress}>{current}/{total}</span>
      </p>
    </div>
    <div className={styles.taskIcon}>
      <img className={styles.taskIconImg} src={Loader2} alt=""/>
    </div>
  </li>
}

export default TaskProcessing
