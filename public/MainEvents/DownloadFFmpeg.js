import { ipcMain } from 'electron'
import * as path from 'path'
import runProcess from './Processes/RunProcess.js'

function mainEventDownloadFFmpeg (mainWindow) {
  ipcMain.on(
    'ffmpeg-download',
    async () => {
      runProcess(
        path.join('BinFiles', 'FFmpegDownload.js'),
        [],
        () => {
          mainWindow.webContents.send('ffmpeg-download-task', 'success')
        },
        (message, current, total) => {
          mainWindow.webContents.send('ffmpeg-download-task', message, current, total)
        },
        (error) => {
          mainWindow.webContents.send('ffmpeg-download-task', 'error', error)
        },
        () => {}
      )
    }
  )
}

export default mainEventDownloadFFmpeg
