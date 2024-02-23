import { ipcMain } from 'electron'
import { getUsbStoriesPath } from './Helpers/UsbPath.js'
import { deleteStories, readStories } from './Helpers/StoriesFiles.js'
import runProcess from './Processes/RunProcess.js'
import * as path from 'path'

function mainEventUsbStoriesReader (mainWindow) {
  ipcMain.on(
    'usb-stories-get',
    async (event, usb) => {
      mainWindow.webContents.send(
        'usb-stories-data',
        usb !== null ? readStories(getUsbStoriesPath(usb.drive)) : []
      )
    }
  )

  ipcMain.on(
    'usb-stories-delete',
    async (event, usb, stories) => {
      if (usb !== null) {
        deleteStories(
          stories.map((s) => s.path),
          () => ipcMain.emit('usb-stories-get', event, usb)
        )
      }
    }
  )
  const startTransfer = (usb, dstPath, stories) => {
    if (!stories.length) {
      mainWindow.webContents.send('stories-transfer-task', '', '', 0, 0)
      return ipcMain.emit('usb-stories-get', {}, usb)
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
      () => startTransfer(usb, dstPath, stories)
    )
  }
  ipcMain.on('stories-transfer', async (event, usb, stories) => startTransfer(usb, getUsbStoriesPath(usb.drive), stories))
}

export default mainEventUsbStoriesReader
