import { ipcMain } from 'electron'
import runProcess from './Processes/RunProcess.js'

import * as path from 'path'

function mainEventImport (mainWindow) {
  let
    isTaskRunning = false,
    filesToProcess = [],
    filesError = [],
    filesErrorMessages = []

  const runImport = () => {
    if (!filesToProcess.length) {
      isTaskRunning = false;
      filesError = []
      filesErrorMessages = []
      mainWindow.webContents.send('import-processing-file', '', '', 0, 0)
      ipcMain.emit('local-stories-get')
      ipcMain.emit('local-music-get')
      return
    }

    isTaskRunning = true;
    const file = filesToProcess.shift()
    mainWindow.webContents.send('import-processing-file', file, 'initialize process', 0, 1)
    mainWindow.webContents.send('import-waiting-files', filesToProcess)
    runProcess(
      path.join('Import','ImportProcess.js'),
      [file],
      () => {
        runImport()
      },
      (message, current, total) => {
        mainWindow.webContents.send('import-processing-file', file, message, current, total)
      },
      (error) => {
        filesError = [...filesError, file]
        filesErrorMessages = [...filesErrorMessages, error]
        mainWindow.webContents.send('import-error-files', filesError, filesErrorMessages)
        runImport()
      }
    )
  }

  ipcMain.on(
    'import-files',
    (event, filesPath) => {
      filesToProcess = [...filesToProcess, ...filesPath]
      if (isTaskRunning) {
        mainWindow.webContents.send('import-waiting-files', filesToProcess)
      } else {
        runImport()
      }
    }
  )
}

export default mainEventImport
