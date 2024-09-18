import { app, BrowserWindow, ipcMain } from 'electron'

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
    if (mainWindow instanceof BrowserWindow) {
      mainWindow.close()
    }
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
}

export default mainEventWindow
