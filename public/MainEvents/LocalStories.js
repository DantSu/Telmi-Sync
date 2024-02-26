import { ipcMain } from 'electron'
import * as fs from 'fs'
import * as path from 'path'
import { getStoriesPath } from './Helpers/AppPaths.js'
import { deleteStories, readStories } from './Helpers/StoriesFiles.js'
import { generateDirNameStory } from './Processes/Helpers/Stories.js'

function mainEventLocalStoriesReader (mainWindow) {
  ipcMain.on(
    'local-stories-get',
    async () => {
      mainWindow.webContents.send('local-stories-data', readStories(getStoriesPath()))
    }
  )

  ipcMain.on(
    'local-stories-update',
    async (event, stories) => {
      if (!Array.isArray(stories)) {
        return
      }
      for (const story of stories) {
        const
          mdPath = path.join(story.path, 'metadata.json'),
          md = JSON.parse(fs.readFileSync(mdPath).toString('utf8'))

        fs.writeFileSync(
          mdPath,
          JSON.stringify(
            Object.assign(
              {
                title: story.title,
                uuid: story.uuid,
                image: md.image,
              },
              story.category ? {category: story.category} : null,
              story.age !== undefined ? {age: story.age} : null,
            )
          )
        )
        const newStoryPath = getStoriesPath(generateDirNameStory(story.title, story.uuid, story.age, story.category))
        if (story.path !== newStoryPath) {
          fs.renameSync(story.path, newStoryPath)
        }
      }
      ipcMain.emit('local-stories-get')
    }
  )

  ipcMain.on(
    'local-stories-delete',
    async (event, stories) => {
      deleteStories(
        stories.map((s) => s.path),
        () => ipcMain.emit('local-stories-get')
      )
    }
  )
}

export default mainEventLocalStoriesReader
