import { ipcMain, shell } from 'electron'

function mainEventLink (mainWindow) {
  ipcMain.on(
    'new-window',
    async (event, url) => {
      console.log(url)
      shell.openExternal(url)
    }
  )
}

export default mainEventLink
