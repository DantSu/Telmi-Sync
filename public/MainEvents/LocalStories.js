import {ipcMain} from 'electron'
import * as fs from 'fs'
import * as path from 'path'
import {getStoriesPath, initTmpPath} from './Helpers/AppPaths.js'
import {deleteStories, readStories} from './Helpers/StoriesFiles.js'
import {createMetadataFile, generateDirNameStory} from './Helpers/Stories.js'
import runProcess from './Processes/RunProcess.js'
import {rmDirectory} from './Helpers/Files.js'

function mainEventLocalStoriesReader(mainWindow) {
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

        createMetadataFile(mdPath, story, md.image)

        const newStoryPath = getStoriesPath(generateDirNameStory(story.title, story.uuid, story.age, story.category))
        if (story.path.toLowerCase() !== newStoryPath.toLowerCase()) {
          rmDirectory(newStoryPath)
          fs.renameSync(story.path, newStoryPath)
        }
      }
      ipcMain.emit('local-stories-get')
    }
  )

  ipcMain.on(
    'local-stories-merge',
    async (event, story) => {
      mainWindow.webContents.send('local-stories-merge-task', story.title, 'initialize', 0, 1)
      mainWindow.webContents.send('local-stories-merge-waiting', [])

      const jsonPath = path.join(initTmpPath('json'), 'stories-merge.json')
      fs.writeFileSync(jsonPath, JSON.stringify(story))

      runProcess(
        path.join('Stories', 'StoriesMerge.js'),
        [jsonPath],
        () => {},
        (message, current, total) => {
          mainWindow.webContents.send('local-stories-merge-task', story.title, message, current, total)
        },
        (error) => {
          mainWindow.webContents.send('local-stories-merge-error', story.title, error)
        },
        () => {
          mainWindow.webContents.send('local-stories-merge-task', '', '', 0, 0)
          ipcMain.emit('local-stories-get')
        }
      )
    }
  )

  const runOptimizeAudio = (stories) => {
    if (!stories.length) {
      mainWindow.webContents.send('stories-optimize-audio-task', '', '', 0, 0)
      return ipcMain.emit('local-stories-get')
    }

    const story = stories.shift()
    mainWindow.webContents.send('stories-optimize-audio-task', story.title, 'initialize', 0, 1)
    mainWindow.webContents.send('stories-optimize-audio-waiting', stories)

    runProcess(
      path.join('Stories', 'StoriesOptimizeAudio.js'),
      [story.path],
      () => {},
      (message, current, total) => {
        mainWindow.webContents.send('stories-optimize-audio-task', story.title, message, current, total)
      },
      (error) => {
        mainWindow.webContents.send('stories-optimize-audio-error', story.title, error)
      },
      () => runOptimizeAudio(stories)
    )
  }
  ipcMain.on('stories-optimize-audio', async (event, stories) => runOptimizeAudio(stories))

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
