import ModalLayout from '../../ModalLayout.js'
import TaskProcessing from './TaskProcessing.js'
import TaskWaiting from './TaskWaiting.js'
import TaskError from './TaskError.js'

import styles from './ModalTasksVisualizer.module.scss'

function ModalTaskVisualizer ({processingTask, waitingTasks, errorTasks, isClosable, onClose}) {
  return <ModalLayout isClosable={isClosable} onClose={onClose}>
    <ul className={styles.container}>
      {processingTask && typeof processingTask === 'object' && <TaskProcessing key={'processing-task'} {...processingTask}/>}
      {Array.isArray(waitingTasks) && waitingTasks.map((v, k) => <TaskWaiting key={'waiting-tasks-' + k} task={v}/>)}
      {Array.isArray(errorTasks) && errorTasks.map((v, k) => <TaskError key={'error-tasks-' + k} task={v.task} message={v.message}/>)}
    </ul>
  </ModalLayout>
}

export default ModalTaskVisualizer
