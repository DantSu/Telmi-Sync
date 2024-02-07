import { useEffect, useState } from 'react'
import ModalTaskVisualizer from '../../Components/Modal/Templates/ModalTasksVisualizer/ModalTasksVisualizer.js'
import { useElectronListener } from '../../Components/Electron/Hooks/UseElectronEvent.js'

function ModalImport ({files, onClose}) {
  const
    [processingFile, setProcessingFile] = useState(null),
    [waitingFiles, setWaitingFiles] = useState(files),
    [errorFiles, setErrorFiles] = useState([]),
    [isClosable, setIsClosable] = useState(false)

  useElectronListener(
    'import-task',
    (file, message, current, total) => {
      if (file === '' && message === '' && current === 0 && total === 0) {
        setProcessingFile(null)
      } else {
        setProcessingFile({task: file, message, current, total})
      }
    },
    [setProcessingFile]
  )

  useElectronListener(
    'import-waiting',
    (waitingFiles) => setWaitingFiles(waitingFiles),
    [setWaitingFiles]
  )

  useElectronListener(
    'import-error',
    (file, error) => setErrorFiles((errors) => ([
      ...errors,
      {task: file, message: error}
    ])),
    [setErrorFiles]
  )

  useEffect(() => {
    if (processingFile === null && !waitingFiles.length) {
      if (!errorFiles.length) {
        onClose()
      } else {
        setIsClosable(true)
      }
    } else {
      setIsClosable(false)
    }
  }, [processingFile, waitingFiles, errorFiles, onClose, setIsClosable])

  return <ModalTaskVisualizer errorTasks={errorFiles}
                              processingTask={processingFile}
                              waitingTasks={waitingFiles}
                              isClosable={isClosable}
                              onClose={onClose}/>
}

export default ModalImport
