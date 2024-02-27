import { ipcMain } from 'electron'
import * as drivelist from 'drivelist'
import * as diskusage from 'diskusage'
import { parseTelmiOSAutorun } from './Helpers/InfFiles.js'
import { readTelmiOSParameters, saveTelmiOSParameters } from './Helpers/TelmiOS.js'
import runProcess from './Processes/RunProcess.js'
import * as path from 'path'

function mainEventTelmiOS (mainWindow) {
  const checkUsb = async () => {
    const drives = (await drivelist.list()).reduce((acc, d) => [...acc, ...d.mountpoints.map((p) => p.path)], [])

    for (const drive of drives) {
      const telmiOS = parseTelmiOSAutorun(drive)
      if (telmiOS !== null) {
        mainWindow.webContents.send('telmios-data', readTelmiOSParameters({drive, telmiOS}))
        return
      }
    }

    mainWindow.webContents.send('telmios-data', null)
  }

  setInterval(checkUsb, 5000)
  setTimeout(checkUsb, 500)

  ipcMain.on(
    'telmios-diskusage',
    async (event, telmiDevice) => mainWindow.webContents.send('telmios-diskusage-data', telmiDevice !== null ? diskusage.checkSync(telmiDevice.drive) : null)
  )

  ipcMain.on('telmios-save-parameters', async (event, telmiDevice) => saveTelmiOSParameters(telmiDevice))

  ipcMain.on(
    'telmios-update',
    async (event, telmiDevice) => {
      if (telmiDevice === undefined || telmiDevice === null) {
        return
      }

      runProcess(
        path.join('TelmiOS', 'Update.js'),
        [telmiDevice.drive],
        () => {},
        (message, current, total) => {
          mainWindow.webContents.send('telmios-update-task', 'telmios-update', message, current, total)
        },
        (error) => {
          mainWindow.webContents.send('telmios-update-error', 'telmios-update', error)
        },
        () => {
          mainWindow.webContents.send('telmios-update-task', '', '', 0, 0)
          checkUsb()
        }
      )
    }
  )

  ipcMain.on(
    'telmios-eject-telmios',
    async (event, telmiDevice) => {
      if (telmiDevice === undefined || telmiDevice === null) {
        return
      }
      runProcess(
        path.join('TelmiOS', 'Eject.js'),
        [telmiDevice.drive],
        () => {},
        () => {},
        () => {},
        () => checkUsb()
      )
    }
  )
}

export default mainEventTelmiOS
