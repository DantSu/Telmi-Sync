import { ipcMain } from 'electron'
import * as drivelist from 'drivelist'
import * as diskusage from 'diskusage'
import { parseTelmiOSAutorun } from './Helpers/InfFiles.js'
import { readTelmiOSParameters, saveTelmiOSParameters } from './Helpers/TelmiOS.js'
import runProcess from './Processes/RunProcess.js'
import * as path from 'path'

function mainEventUSB (mainWindow) {
  const checkUsb = async () => {
    const drives = (await drivelist.list()).reduce((acc, d) => [...acc, ...d.mountpoints.map((p) => p.path)], [])

    for (const drive of drives) {
      const telmiOS = parseTelmiOSAutorun(drive)
      if (telmiOS !== null) {
        mainWindow.webContents.send('usb-data', readTelmiOSParameters({drive, diskusage: diskusage.checkSync(drive), telmiOS}))
        return
      }
    }

    mainWindow.webContents.send('usb-data', null)
  }

  setInterval(checkUsb, 5000)
  setTimeout(checkUsb, 500)

  ipcMain.on('usb-save-parameters', async (event, usb) => saveTelmiOSParameters(usb))

  ipcMain.on(
    'usb-update-telmios',
    async (event, usb) => {
      if (usb === undefined || usb === null) {
        return
      }

      runProcess(
        path.join('TelmiOS', 'Update.js'),
        [usb.drive],
        () => {},
        (message, current, total) => {
          mainWindow.webContents.send('usb-update-telmios-task', 'telmios-update', message, current, total)
        },
        (error) => {
          mainWindow.webContents.send('usb-update-telmios-error', 'telmios-update', error)
        },
        () => {
          mainWindow.webContents.send('usb-update-telmios-task', '', '', 0, 0)
          checkUsb()
        }
      )
    }
  )

  ipcMain.on(
    'usb-eject-telmios',
    async (event, usb) => {
      if (usb === undefined || usb === null) {
        return
      }

      runProcess(
        path.join('TelmiOS', 'Eject.js'),
        [usb.drive],
        () => {},
        () => {},
        () => {},
        () => checkUsb()
      )
    }
  )
}

export default mainEventUSB
