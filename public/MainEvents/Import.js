import { ipcMain } from 'electron'
import runProcess from './Processes/RunProcess.js'

import * as path from 'path'

function mainEventImport (mainWindow) {
  let
    isTaskRunning = false,
    filesToProcess = []

  const runImport = () => {
    if (!filesToProcess.length) {
      isTaskRunning = false;
      mainWindow.webContents.send('import-task', '', '', 0, 0)
      ipcMain.emit('local-stories-get')
      ipcMain.emit('local-musics-get')
      return
    }

    isTaskRunning = true;
    const file = filesToProcess.shift()
    mainWindow.webContents.send('import-task', file, 'initialize', 0, 1)
    mainWindow.webContents.send('import-waiting', filesToProcess)
    runProcess(
      path.join('Import','ImportProcess.js'),
      [file],
      () => {
        runImport()
      },
      (message, current, total) => {
        mainWindow.webContents.send('import-task', file, message, current, total)
      },
      (error) => {
        mainWindow.webContents.send('import-error', file, error)
        runImport()
      }
    )
  }

  ipcMain.on(
    'import',
    (event, filesPath) => {
      filesToProcess = [...filesToProcess, ...filesPath]
      if (isTaskRunning) {
        mainWindow.webContents.send('import-waiting', filesToProcess)
      } else {
        runImport()
      }
    }
  )
}

export default mainEventImport
