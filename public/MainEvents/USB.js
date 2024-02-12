import { ipcMain } from 'electron'
import * as drivelist from 'drivelist'
import { parseTelmiOSAutorun, saveTelmiOSParameters } from './Helpers/InfFiles.js'
import * as path from 'path'

function mainEventUSB (mainWindow) {
  const checkUsb = async () => {
    const drives = (await drivelist.list()).reduce((acc, d) => [...acc, ...d.mountpoints.map((p) => p.path)], [])

    for (const drive of drives) {
      const telmiOS = parseTelmiOSAutorun(drive)
      if (telmiOS !== null) {
        mainWindow.webContents.send('usb-data', {drive, telmiOS})
        return
      }
    }

    mainWindow.webContents.send('usb-data', null)
  }

  setInterval(checkUsb, 5000)

  ipcMain.on(
    'usb-save-parameters',
    async (event, usb) => saveTelmiOSParameters(usb)
  )
}

export default mainEventUSB
