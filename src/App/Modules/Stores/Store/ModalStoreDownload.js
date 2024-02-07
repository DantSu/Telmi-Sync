import { useEffect, useState } from 'react'
import ModalTaskVisualizer from '../../../Components/Modal/Templates/ModalTasksVisualizer/ModalTasksVisualizer.js'
import { useElectronEmitter, useElectronListener } from '../../../Components/Electron/Hooks/UseElectronEvent.js'

function ModalStoreDownload ({stories, onClose}) {
  const
    [processingStory, setProcessingStory] = useState(null),
    [waitingStories, setWaitingStories] = useState(stories.map((s) => s.title)),
    [errorStories, setErrorStories] = useState([]),
    [isClosable, setIsClosable] = useState(false)

  useElectronListener(
    'store-download-task',
    (title, message, current, total) => {
      if (title === '' && message === '' && current === 0 && total === 0) {
        setProcessingStory(null)
      } else {
        setProcessingStory({task: title, message, current, total})
      }
    },
    [setProcessingStory]
  )

  useElectronListener(
    'store-download-waiting',
    (waitingStories) => setWaitingStories(waitingStories.map((s) => s.title)),
    [setWaitingStories]
  )

  useElectronListener(
    'store-download-error',
    (story, error) => setErrorStories((errors) => ([
      ...errors,
      {
        task: story.title,
        message: error
      }
    ])),
    [setErrorStories]
  )

  useElectronEmitter('store-download', [stories])

  useEffect(() => {
    if (processingStory === null && !waitingStories.length) {
      if (!errorStories.length) {
        onClose()
      } else {
        setIsClosable(true)
      }
    } else {
      setIsClosable(false)
    }
  }, [processingStory, waitingStories, errorStories, onClose, setIsClosable])

  return <ModalTaskVisualizer errorTasks={errorStories}
                              processingTask={processingStory}
                              waitingTasks={waitingStories}
                              isClosable={isClosable}
                              onClose={onClose}/>
}

export default ModalStoreDownload
