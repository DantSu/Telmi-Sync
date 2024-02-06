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
    'import-processing-file',
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
    'import-waiting-files',
    (filesToProcess) => setWaitingFiles(filesToProcess),
    [setWaitingFiles]
  )

  useElectronListener(
    'import-error-files',
    (filesError, filesErrorMessages) => setErrorFiles(filesError.map((v, k) => ({
      task: v,
      message: <>Le format semble être incompatible avec Telmi Sync. <strong>(Code erreur : {filesErrorMessages[k]})</strong></>
    }))),
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
