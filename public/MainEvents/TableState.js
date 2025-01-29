import fs from 'fs'
import path from 'path'
import {ipcMain} from 'electron'
import {getParametersPath} from './Helpers/AppPaths.js'
import {createPathDirectories} from './Helpers/Files.js'

function mainEventTableState(mainWindow) {
  ipcMain.on(
    'tablestate-get',
    async (event, tableId) => {
      const
        paramsPath = getParametersPath('tablestate'),
        jsonPath = path.join(paramsPath, tableId + '.json')
      createPathDirectories(paramsPath)

      if(!fs.existsSync(jsonPath)) {
        mainWindow.webContents.send('tablestate-data', tableId, null)
        return
      }

      mainWindow.webContents.send('tablestate-data', tableId, JSON.parse(fs.readFileSync(jsonPath).toString('utf8')))
    }
  )
  ipcMain.on(
    'tablestate-save',
    async (event, tableId, tableState) => {
      const
        paramsPath = getParametersPath('tablestate'),
        jsonPath = path.join(paramsPath, tableId + '.json')
      createPathDirectories(paramsPath)
      fs.writeFileSync(jsonPath, JSON.stringify(tableState))
    }
  )
}

export default mainEventTableState
