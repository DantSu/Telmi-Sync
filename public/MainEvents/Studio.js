import {ipcMain} from 'electron'
import * as fs from 'fs'
import * as path from 'path'

function mainEventStudio(mainWindow) {
  const checkNotes = (metadata, nodes) => {
    const notesPath = path.join(metadata.path, 'notes.json')
    if (fs.existsSync(notesPath)) {
      return JSON.parse(fs.readFileSync(notesPath).toString('utf8'))
    }

    const notes = Object.keys(nodes.stages).reduce(
      (acc, k) => ({...acc, [k]: {title: k, notes: ''}}),
      {startStage: {title: 'Start Stage', notes: ''}}
    )
    fs.writeFileSync(notesPath, JSON.stringify(notes))
    return notes
  }

  ipcMain.on(
    'studio-story-get',
    async (event, metadata) => {
      const nodes = JSON.parse(fs.readFileSync(path.join(metadata.path, 'nodes.json')).toString('utf8'))
      mainWindow.webContents.send('studio-story-data', {metadata, nodes, notes: checkNotes(metadata, nodes)})
    }
  )
}

export default mainEventStudio
