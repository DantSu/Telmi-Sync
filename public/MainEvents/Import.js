import {ipcMain} from 'electron'
import runProcess from './Processes/RunProcess.js'

import * as path from 'path'

function mainEventImport(mainWindow) {
  let
    taskRunning = null,
    filesToProcess = []

  const runImport = () => {
    if (!filesToProcess.length) {
      taskRunning = null
      mainWindow.webContents.send('import-task', '', '', 0, 0)
      ipcMain.emit('local-stories-get')
      ipcMain.emit('local-musics-get')
      return
    }
    const file = filesToProcess.shift()
    mainWindow.webContents.send('import-task', file, 'initialize', 0, 1)
    mainWindow.webContents.send('import-waiting', filesToProcess)
    taskRunning = runProcess(
      mainWindow,
      path.join('Import', 'ImportProcess.js'),
      [file],
      () => {},
      (message, current, total) => {
        mainWindow.webContents.send('import-task', file, message, current, total)
      },
      (error) => {
        mainWindow.webContents.send('import-error', file, error)
      },
      () => runImport()
    )
  }

  ipcMain.on(
    'import',
    async (event, filesPath) => {
      filesToProcess = [...filesToProcess, ...filesPath]
      if (taskRunning !== null) {
        mainWindow.webContents.send('import-waiting', filesToProcess)
      } else {
        runImport()
      }
    }
  )

  ipcMain.on(
    'import-cancel',
    async () => {
      if (taskRunning !== null) {
        taskRunning.process.kill()
      }
    }
  )
}

export default mainEventImport
