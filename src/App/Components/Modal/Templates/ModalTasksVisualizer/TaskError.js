import styles from './ModalTasksVisualizer.module.scss'

function TaskError ({task, message}) {
  return <li className={styles.waitingTaskContainer}>
    <div className={styles.taskTextes}>
      <h2 className={styles.taskTitle}>{task}</h2>
      <p className={styles.taskDescription}>{message}</p>
    </div>
    <div className={styles.taskIcon}>{'\uf071'}</div>
  </li>
}

export default TaskError
