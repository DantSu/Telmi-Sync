import { useState } from 'react'
import { useRouter } from '../../Router/RouterHooks.js'
import { routeSynchronize } from '../Synchronize/Routes.js'

import ModalTaskVisualizer from '../../Components/Modal/Templates/ModalTasksVisualizer/ModalTasksVisualizer.js'
import { useElectronEmitter, useElectronListener } from '../../Components/Electron/Hooks/UseElectronEvent.js'

function DownloadFFmpeg () {
  const
    setRoute = useRouter(),
    [processingTask, setProcessingTask] = useState(null),
    [errorTasks, setErrorTasks] = useState([])

  useElectronEmitter('ffmpeg-download', [])

  useElectronListener(
    'ffmpeg-download-task',
    (message, current, total) => {
      if (message === 'success') {
        setRoute(routeSynchronize)
      } else if (message === 'error') {
        setErrorTasks([{
          task: 'ffmpeg-download',
          message: current
        }])
      } else {
        setProcessingTask({
          task: 'ffmpeg-download',
          message: 'please-wait',
          current,
          total
        })
      }
    },
    [setRoute, setProcessingTask, setErrorTasks]
  )

  return <ModalTaskVisualizer processingTask={processingTask} errorTasks={errorTasks}/>
}

export default DownloadFFmpeg
