import { app, BrowserWindow, ipcMain } from 'electron'

function mainEventWindow (mainWindow) {
  ipcMain.on('change-size', () => {
    if (mainWindow instanceof BrowserWindow) {
      mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
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
