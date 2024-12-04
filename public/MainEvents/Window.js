import { app, BrowserWindow, ipcMain } from 'electron'
import {rmDirectory} from './Helpers/Files.js'
import {getTmpPath} from './Helpers/AppPaths.js'

function mainEventWindow (mainWindow) {
  ipcMain.on('window-maximize', () => {
    if (mainWindow instanceof BrowserWindow) {
      mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
    }
  })

  ipcMain.on('window-minimize', () => {
    if (mainWindow instanceof BrowserWindow) {
      mainWindow.minimize()
    }
  })

  ipcMain.on('close', () => {
    rmDirectory(getTmpPath())

    if (mainWindow instanceof BrowserWindow) {
      mainWindow.close()
    }

    app.quit()
  })
}

export default mainEventWindow
