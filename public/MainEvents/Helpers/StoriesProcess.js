import * as path from 'path'
import runProcess from '../Processes/RunProcess.js'

const
  deleteStories = (mainWindow, storiesPath, onFinished) => {
    if (!Array.isArray(storiesPath)) {
      return false
    }
    runProcess(
      mainWindow,
      path.join('Stories', 'StoriesDelete.js'),
      storiesPath,
      () => {
      },
      () => {
      },
      () => {
      },
      onFinished
    )
    return true
  }

export {deleteStories}
