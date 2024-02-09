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
      if (usb !== null && deleteMusic(getUsbMusicPath(usb.drive), ids)) {
        ipcMain.emit('usb-musics-get', event, usb)
      }
    }
  )


  const startTransfer = (usb, musicPath, musics) => {
    if (!musics.length) {
      mainWindow.webContents.send('musics-transfer-task', '', '', 0, 0)
      return ipcMain.emit('usb-musics-get', {}, usb)
    }

    const music = musics.shift()
    mainWindow.webContents.send('musics-transfer-task', music.title, 'initialize', 0, 1)
    mainWindow.webContents.send('musics-transfer-waiting', musics)

    runProcess(
      path.join('Music', 'MusicTransfer.js'),
      [musicPath, music.id],
      () => {
        startTransfer(usb, musicPath, musics)
      },
      (message, current, total) => {
        mainWindow.webContents.send('musics-transfer-task', music.title, message, current, total)
      },
      (error) => {
        mainWindow.webContents.send('musics-transfer-error', music, error)
        startTransfer(usb, musicPath, musics)
      }
    )
  }
  ipcMain.on('musics-transfer', async (event, usb, musics) => startTransfer(usb, getUsbMusicPath(usb.drive), musics))
}

export default mainEventUsbMusicReader
