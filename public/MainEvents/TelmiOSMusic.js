import {ipcMain} from 'electron'
import {deleteMusic, readMusic} from './Helpers/MusicFiles.js'
import {getTelmiOSMusicPath} from './Helpers/TelmiOSPath.js'
import runProcess from './Processes/RunProcess.js'
import * as path from 'path'

function mainEventTelmiOSMusicReader(mainWindow) {
  ipcMain.on(
    'telmios-musics-get',
    async (event, telmiDevice) => {
      mainWindow.webContents.send(
        'telmios-musics-data',
        telmiDevice !== null ? readMusic(getTelmiOSMusicPath(telmiDevice.drive)) : []
      )
    }
  )

  ipcMain.on(
    'telmios-musics-delete',
    async (event, telmiDevice, ids) => {
      if (telmiDevice !== null) {
        deleteMusic(
          mainWindow,
          getTelmiOSMusicPath(telmiDevice.drive),
          ids,
          () => {
            ipcMain.emit('telmios-musics-get', event, telmiDevice)
            ipcMain.emit('telmios-diskusage', event, telmiDevice)
          }
        )
      }
    }
  )

  ipcMain.on('musics-transfer', async (event, telmiDevice, musics) => {
    const
      musicPath = getTelmiOSMusicPath(telmiDevice.drive),
      onFinished = () => {
        mainWindow.webContents.send('musics-transfer-task', '', '', 0, 0)
        ipcMain.emit('telmios-musics-get', event, telmiDevice)
        ipcMain.emit('telmios-diskusage', event, telmiDevice)
      }

    runProcess(
      mainWindow,
      path.join('Music', 'MusicTransfer.js'),
      [musicPath, ...musics.map((m) => m.id)],
      () => {},
      (message, current, total) => {
        mainWindow.webContents.send('musics-transfer-task', 'musics-transferring', message, current, total)
      },
      () => {},
      onFinished
    )
  })
}

export default mainEventTelmiOSMusicReader
