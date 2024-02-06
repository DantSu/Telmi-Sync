import { useState } from 'react'
import ModalTaskVisualizer from '../../../Components/Modal/Templates/ModalTasksVisualizer/ModalTasksVisualizer.js'
import { useElectronEmitter, useElectronListener } from '../../../Components/Electron/Hooks/UseElectronEvent.js'

function ModalStoreDownload ({story, onClose}) {
  const
    [processingFile, setProcessingFile] = useState({task: story.title, message: 'waiting', current: 0, total: 1}),
    [errorFiles, setErrorFiles] = useState([]),
    [isClosable, setIsClosable] = useState(false)

  useElectronListener(
    'store-download-task',
    (file, message, current, total) => {
      if (message === 'success') {
        onClose()
      } else if (message === 'error') {
        setIsClosable(true)
        setProcessingFile(null)
        setErrorFiles([{
          task: file,
          message: <>Le format semble être incompatible avec Telmi Sync. <strong>(Code erreur : {message})</strong></>
        }])
      } else {
        setProcessingFile({task: file, message, current, total})
      }
    },
    [setProcessingFile]
  )
  useElectronEmitter('store-download', [story])

  return <ModalTaskVisualizer errorTasks={errorFiles}
                              processingTask={processingFile}
                              isClosable={isClosable}
                              onClose={onClose}/>
}

export default ModalStoreDownload
