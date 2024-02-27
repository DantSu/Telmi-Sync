import { ipcMain } from 'electron'
import { getTelmiOSStoriesPath } from './Helpers/TelmiOSPath.js'
import { deleteStories, readStories } from './Helpers/StoriesFiles.js'
import runProcess from './Processes/RunProcess.js'
import * as path from 'path'

function mainEventTelmiOSStoriesReader (mainWindow) {
  ipcMain.on(
    'telmios-stories-get',
    async (event, telmiDevice) => {
      mainWindow.webContents.send(
        'telmios-stories-data',
        telmiDevice !== null ? readStories(getTelmiOSStoriesPath(telmiDevice.drive)) : []
      )
    }
  )

  ipcMain.on(
    'telmios-stories-delete',
    async (event, telmiDevice, stories) => {
      if (telmiDevice !== null) {
        deleteStories(
          stories.map((s) => s.path),
          () => {
            ipcMain.emit('telmios-stories-get', event, telmiDevice)
            ipcMain.emit('telmios-diskusage', event, telmiDevice)
          }
        )
      }
    }
  )
  const startTransfer = (telmiDevice, dstPath, stories) => {
    if (!stories.length) {
      mainWindow.webContents.send('stories-transfer-task', '', '', 0, 0)
      ipcMain.emit('telmios-stories-get', {}, telmiDevice)
      return ipcMain.emit('telmios-diskusage', {}, telmiDevice)
    }

    const story = stories.shift()
    mainWindow.webContents.send('stories-transfer-task', story.title, 'initialize', 0, 1)
    mainWindow.webContents.send('stories-transfer-waiting', stories)

    runProcess(
      path.join('Stories', 'StoryTransfer.js'),
      [dstPath, story.path],
      () => {},
      (message, current, total) => {
        mainWindow.webContents.send('stories-transfer-task', story.title, message, current, total)
      },
      (error) => {
        mainWindow.webContents.send('stories-transfer-error', story.title, error)
      },
      () => startTransfer(telmiDevice, dstPath, stories)
    )
  }
  ipcMain.on('stories-transfer', async (event, telmiDevice, stories) => startTransfer(telmiDevice, getTelmiOSStoriesPath(telmiDevice.drive), stories))
}

export default mainEventTelmiOSStoriesReader
