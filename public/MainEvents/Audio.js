import {ipcMain, systemPreferences} from 'electron'
import * as path from 'path'
import fs from 'fs'
import {initTmpPath} from './Helpers/AppPaths.js'
import runProcess from './Processes/RunProcess.js'

function mainEventAudio(mainWindow) {

  ipcMain.on(
    'audio-analyze-request',
    async (event, mp3Path) => {
      const fileTmpPath = path.join(initTmpPath(path.join('audio-analyze', Date.now().toString(36))), 'audio.raw')
      runProcess(
        mainWindow,
        path.join('Audio', 'AudioAnalyze.js'),
        [mp3Path, fileTmpPath],
        () => {
          const buffer = fs.readFileSync(fileTmpPath)
          mainWindow.webContents.send('audio-analyze-data', mp3Path, new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength))
        },
        () => {},
        () => {},
        () => {}
      )
    }
  )

  ipcMain.on(
    'audio-crop',
    async (event, audioPath, startTime, endTime) => {
      const fileTmpPath = path.join(initTmpPath(path.join('audio-crop', Date.now().toString(36))), 'audio.mp3')
      runProcess(
        mainWindow,
        path.join('Audio', 'AudioCrop.js'),
        [audioPath, fileTmpPath, startTime, endTime],
        () => {},
        (message, current, total) => {
          mainWindow.webContents.send('audio-crop-task', 'audio-crop', message, current, total)
        },
        () => {},
        () => {
          mainWindow.webContents.send('audio-crop-data', audioPath, fs.existsSync(fileTmpPath) ? fileTmpPath : null)
          mainWindow.webContents.send('audio-crop-task', '', '', 0, 0)
        }
      )
    }
  )
  ipcMain.on(
    'audio-amplification-default-get',
    async (event, mp3Path) => {
      const fileTmpPath = path.join(initTmpPath(path.join('audio-analyze', 'amplification')), 'value.txt')
      runProcess(
        mainWindow,
        path.join('Audio', 'AudioAmplificationDefault.js'),
        [mp3Path, fileTmpPath],
        () => {},
        () => {},
        () => {},
        () => {
          mainWindow.webContents.send('audio-amplification-default', fs.existsSync(fileTmpPath) ? parseFloat(fs.readFileSync(fileTmpPath).toString('utf8')) : 0)
        }
      )
    }
  )
  ipcMain.on(
    'audio-amplification',
    async (event, audioPath, decibel) => {
      const fileTmpPath = path.join(initTmpPath(path.join('audio-amplification', Date.now().toString(36))), 'audio.mp3')
      runProcess(
        mainWindow,
        path.join('Audio', 'AudioAmplification.js'),
        [audioPath, fileTmpPath, decibel],
        () => {
        },
        (message, current, total) => {
          mainWindow.webContents.send('audio-amplification-task', 'audio-amplify', message, current, total)
        },
        () => {},
        () => {
          mainWindow.webContents.send('audio-amplification-data', fs.existsSync(fileTmpPath) ? fileTmpPath : null)
          mainWindow.webContents.send('audio-amplification-task', '', '', 0, 0)
        }
      )
    }
  )

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

export default mainEventAudio
