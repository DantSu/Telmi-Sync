import { ipcMain } from 'electron'
import { deleteMusic, readMusic } from './Helpers/Music.js'
import { getUsbMusicPath } from './Helpers/UsbPath.js'
import runProcess from './Processes/RunProcess.js'
import * as path from 'path'

function mainEventUsbMusicReader (mainWindow) {
  ipcMain.on(
    'usb-musics-get',
    async (event, usb) => {
      mainWindow.webContents.send(
        'usb-musics-data',
        usb !== null ? readMusic(getUsbMusicPath(usb.drive)) : []
      )
    }
  )

  ipcMain.on(
    'usb-musics-delete',
    async (event, usb, ids) => {
      if (usb !== null) {
        deleteMusic(
          getUsbMusicPath(usb.drive),
          ids,
          () => ipcMain.emit('usb-musics-get', event, usb)
        )
      }
    }
  )

  ipcMain.on('musics-transfer', async (event, usb, musics) => {
    const
      musicPath = getUsbMusicPath(usb.drive),
      end = () => {
        mainWindow.webContents.send('musics-transfer-task', '', '', 0, 0)
        ipcMain.emit('usb-musics-get', event, usb)
      }

    runProcess(
      path.join('Music', 'MusicTransfer.js'),
      [musicPath, ...musics.map((m) => m.id)],
      end,
      (message, current, total) => {
        mainWindow.webContents.send('musics-transfer-task', 'musics-transferring', message, current, total)
      },
      end
    )
  })
}

export default mainEventUsbMusicReader
