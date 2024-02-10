import { ipcMain } from 'electron'
import * as fs from 'fs'
import * as path from 'path'
import { getStoriesPath } from './Helpers/AppPaths.js'
import { deleteStories, readStories } from './Helpers/StoriesFiles.js'

function mainEventLocalStoriesReader (mainWindow) {
  ipcMain.on(
    'local-stories-get',
    async () => {
      mainWindow.webContents.send('local-stories-data', readStories(getStoriesPath()))
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
    'local-stories-delete',
    async (event, storiesUuid) => {
      deleteStories(
        getStoriesPath(),
        storiesUuid,
        () => ipcMain.emit('local-stories-get')
      )
    }
  )
}

export default mainEventLocalStoriesReader
