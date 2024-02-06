import { ipcMain } from 'electron'
import * as fs from 'fs'
import * as path from 'path'
import { getStoriesPath } from './Helpers/AppPaths.js'
import { rmDirectory } from './Helpers/Files.js'

function mainEventLocalStoriesReader (mainWindow) {
  ipcMain.on(
    'local-stories-get',
    async () => {
      const storiesPath = getStoriesPath()
      mainWindow.webContents.send(
        'local-stories-data',
        fs.readdirSync(storiesPath)
          .map((d) => {
            const md = JSON.parse(fs.readFileSync(path.join(storiesPath, d, 'metadata.json')).toString('utf8'))
            md.image = path.join(storiesPath, d, md.image)
            md.audio = path.join(storiesPath, d, 'title.mp3')
            return md
          })
      )
    }
  )

  ipcMain.on(
    'local-story-update',
    async (event, storyUuid, storyTitle) => {
      if (
        typeof storyUuid === 'string' && storyUuid !== '' &&
        typeof storyTitle === 'string' && storyTitle !== ''
      ) {
        const
          mdPath = path.join(getStoriesPath(storyUuid), 'metadata.json'),
          md = JSON.parse(fs.readFileSync(mdPath).toString('utf8'))
        md.title = storyTitle
        fs.writeFileSync(mdPath, JSON.stringify(md))
        ipcMain.emit('local-stories-get')
      }
    }
  )

  ipcMain.on(
    'local-story-delete',
    async (event, storyUuid) => {
      if (typeof storyUuid === 'string' && storyUuid !== '') {
        rmDirectory(getStoriesPath(storyUuid))
        ipcMain.emit('local-stories-get')
      }
    }
  )
}

export default mainEventLocalStoriesReader
