import {ipcMain} from 'electron'
import * as path from 'path'
import fs from 'fs'
import {initTmpPath} from './Helpers/AppPaths.js'

function mainEventAudioRecord(mainWindow) {
  ipcMain.on(
    'audio-record-buffer-to-file',
    async (event, arrayBuffer) => {
      const audioPath = path.join(initTmpPath(path.join('audios', Date.now().toString(36))), 'record.webm')
      fs.writeFileSync(audioPath, Buffer.from(arrayBuffer))
      mainWindow.webContents.send('audio-record-file', audioPath)
    }
  )
}

export default mainEventAudioRecord
