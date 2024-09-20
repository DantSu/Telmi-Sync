import {ipcMain} from 'electron'
import * as path from 'path'
import {initTmpPath} from './Helpers/AppPaths.js'
import runProcess from './Processes/RunProcess.js'

function mainEventFileManager(mainWindow) {
  ipcMain.on(
    'file-copy',
    async (event, filePath) => {
      const
        fileTmpPath = path.join(initTmpPath(path.join('files', Date.now().toString(36))), 'tmp' + path.extname(filePath).toLowerCase())
      runProcess(
        path.join('FileManager', 'FileCopy.js'),
        [filePath, fileTmpPath],
        () => {
          mainWindow.webContents.send('file-copy-succeed', fileTmpPath)
        },
        (message, current, total) => {
          mainWindow.webContents.send('file-copy-task', 'copy-files', message, current, total)
        },
        (error) => {
          mainWindow.webContents.send('file-copy-task', 'error', error)
        },
        () => {
          mainWindow.webContents.send('file-copy-task', '', '', 0, 0)
        }
      )
    }
  )
}

export default mainEventFileManager
