import {ipcMain} from 'electron'
import * as drivelist from 'drivelist'
import * as diskusage from 'diskusage'
import {parseTelmiOSAutorun} from './Helpers/InfFiles.js'
import {readTelmiOSParameters, saveTelmiOSParameters} from './Helpers/TelmiOS.js'
import runProcess from './Processes/RunProcess.js'
import * as path from 'path'

function mainEventTelmiOS(mainWindow) {
  const checkUsbDevices = async () => {
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

  setInterval(checkUsbDevices, 5000)
  setTimeout(checkUsbDevices, 500)

  ipcMain.on(
    'telmios-disklist',
    async (event) => {
      mainWindow.webContents.send(
        'telmios-disklist-data',
        (await drivelist.list())
          .filter((d) => d.isRemovable && d.partitionTableType !== null)
          .reduce((acc, d) => [...acc, ...d.mountpoints.map((p) => ({name: d.description, drive: p.path}))], [])
      )
    }
  )

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
          checkUsbDevices()
        }
      )
    }
  )

  ipcMain.on(
    'telmios-eject',
    async (event, telmiDevice) => {
      if (telmiDevice === undefined || telmiDevice === null) {
        return
      }
      runProcess(
        path.join('TelmiOS', 'Eject.js'),
        [telmiDevice.drive],
        () => {},
        (message, current, total) => {
          mainWindow.webContents.send('telmios-eject-task', 'telmios-eject', message, current, total)
        },
        (error) => {
          mainWindow.webContents.send('telmios-eject-error', 'telmios-eject', error)
        },
        () => {
          mainWindow.webContents.send('telmios-eject-task', '', '', 0, 0)
          checkUsbDevices()
        }
      )
    }
  )

  ipcMain.on(
    'telmios-cardmaker',
    async (event, drive) => {
      if (drive === undefined || drive === null) {
        return
      }
      runProcess(
        path.join('TelmiOS', 'CardMaker.js'),
        [drive.drive],
        () => {},
        (message, current, total) => {
          mainWindow.webContents.send('telmios-cardmaker-task', 'telmios-cardmaker', message, current, total)
        },
        (error) => {
          mainWindow.webContents.send('telmios-cardmaker-error', 'telmios-cardmaker', error)
        },
        () => {
          mainWindow.webContents.send('telmios-cardmaker-task', '', '', 0, 0)
          checkUsbDevices()
        }
      )
    }
  )
}

export default mainEventTelmiOS
