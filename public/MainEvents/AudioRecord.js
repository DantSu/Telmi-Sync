import {ipcMain, systemPreferences} from 'electron'
import * as path from 'path'
import fs from 'fs'
import {initTmpPath} from './Helpers/AppPaths.js'

function mainEventAudioRecord(mainWindow) {

  ipcMain.on(
    'audio-request-mic',
    async () => {
      try {
        if (systemPreferences.getMediaAccessStatus('microphone') === 'granted') {
          mainWindow.webContents.send('audio-request-mic-result', true)
          return
        }
        mainWindow.webContents.send(
          'audio-request-mic-result',
          await systemPreferences.askForMediaAccess('microphone')
        )
      } catch (e) {
        mainWindow.webContents.send('audio-request-mic-result', true)
      }
    }
  )

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
