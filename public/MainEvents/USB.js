import * as drivelist from 'drivelist'
import { parseTelmiOSAutorun } from './Helpers/InfFiles.js'

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
}

export default mainEventUSB
