import {ipcMain} from 'electron'
import path from 'path'
import runProcess from './Processes/RunProcess.js'

function mainEventServer(mainWindow) {
  let serverTask = null
  ipcMain.on('server-launch', async (event) => {
    if (serverTask === null) {
      console.log('START')
      serverTask = runProcess(
        mainWindow,
        path.join('Server', 'Server.js'),
        [],
        () => {},
        (message, current, total) => {
          mainWindow.webContents.send('server-listen', 'server-status', message, current, total)
        },
        (error) => {
          mainWindow.webContents.send('server-listen', 'server-error', error)
        },
        () => {}
      )
    }
  })
  ipcMain.on('server-stop', async () => {
      if (serverTask !== null) {
        serverTask.process.kill()
        serverTask = null
      }
    }
  )
}

export default mainEventServer
