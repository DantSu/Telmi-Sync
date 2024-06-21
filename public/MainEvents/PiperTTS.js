import { ipcMain } from 'electron'
import * as path from 'path'
import runProcess from './Processes/RunProcess.js'

function mainEventDownloadFFmpeg (mainWindow) {
  ipcMain.on(
    'piper-convert',
    async (text) => {
      runProcess(
        path.join('PiperTTS', 'PiperTTS.js'),
        [text],
        () => {
          mainWindow.webContents.send('piper-convert-task', 'success')
        },
        (message, current, total) => {
          mainWindow.webContents.send('piper-convert-task', message, current, total)
        },
        (error) => {
          mainWindow.webContents.send('piper-convert-task', 'error', error)
        },
        () => {}
      )
    }
  )
}

export default mainEventDownloadFFmpeg
