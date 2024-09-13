import {ipcMain} from 'electron'
import * as path from 'path'
import fs from 'fs'
import {initTmpPath} from './Helpers/AppPaths.js'
import runProcess from './Processes/RunProcess.js'

function mainEventPiperTTS(mainWindow) {
  ipcMain.on(
    'piper-convert',
    async (event, text) => {
      const
        jsonPath = path.join(initTmpPath('json'), 'piper.json'),
        wavePath = path.join(initTmpPath(path.join('audios', Date.now().toString(36))), 'piper.wav')
      fs.writeFileSync(jsonPath, JSON.stringify({"text": text, "output_file": wavePath}))
      runProcess(
        path.join('PiperTTS', 'PiperTTS.js'),
        [jsonPath],
        () => {
          mainWindow.webContents.send('piper-convert-succeed', wavePath)
        },
        (message, current, total) => {
          mainWindow.webContents.send('piper-convert-task', 'tts-converting', message, current, total)
        },
        (error) => {
          mainWindow.webContents.send('piper-convert-task', 'error', error)
        },
        () => {
          mainWindow.webContents.send('piper-convert-task', '', '', 0, 0)
        }
      )
    }
  )
}

export default mainEventPiperTTS
