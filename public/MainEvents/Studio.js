import {ipcMain} from 'electron'
import * as fs from 'fs'
import * as path from 'path'
import {getExtraResourcesPath, getStoriesPath, initTmpPath} from './Helpers/AppPaths.js'
import runProcess from './Processes/RunProcess.js'
import {readStoryMetadata} from './Helpers/StoriesFiles.js'
import {generateDirNameStory, getMetadataStory} from './Helpers/Stories.js'

function mainEventStudio(mainWindow) {
  const
    checkNotes = (storyPath, nodes) => {
      const notesPath = path.join(storyPath, 'notes.json')
      if (fs.existsSync(notesPath)) {
        return JSON.parse(fs.readFileSync(notesPath).toString('utf8'))
      }

      const notes = Object.keys(nodes.stages).reduce(
        (acc, k) => ({...acc, [k]: {title: k, notes: ''}}),
        {}
      )
      fs.writeFileSync(notesPath, JSON.stringify(notes))
      return notes
    },
    checkNodes = (nodes) => {
      if (Array.isArray(nodes.inventory) && nodes.inventory.length) {
        return {
          startAction: nodes.startAction,
          inventory: nodes.inventory.map((i, k) => ({id: 'i' + k, ...i})),
          stages: Object.keys(nodes.stages).reduce(
            (acc, stageKey) => {
              const stage = nodes.stages[stageKey]
              if (Array.isArray(stage.items)) {
                return {
                  ...acc,
                  [stageKey]: {
                    ...stage,
                    items: stage.items.map((i) => ({
                      ...i,
                      item: 'i' + i.item
                    }))
                  }
                }
              } else {
                return {...acc, [stageKey]: stage}
              }
            },
            {}
          ),
          actions: Object.keys(nodes.actions).reduce(
            (acc, actionKey) => ({
              ...acc,
              [actionKey]: nodes.actions[actionKey].map((action) => {
                if (Array.isArray(action.conditions)) {
                  return {
                    ...action,
                    conditions: action.conditions.map((c) => ({
                      ...c,
                      item: 'i' + c.item
                    }))
                  }
                } else {
                  return action
                }
              })
            }),
            {}
          )
        }
      }
      return nodes
    }


  ipcMain.on(
    'studio-story-get',
    async (event, metadataSrc) => {
      initTmpPath('audios')
      if (metadataSrc.path === undefined) {
        mainWindow.webContents.send(
          'studio-story-data',
          {
            metadata: {
              title: 'Default title',
              uuid: 'ffffff-' + Date.now().toString(16),
              newAudioTitle: path.join(getExtraResourcesPath(), 'assets', 'audios', 'story-default-title.mp3'),
              newImageTitle: path.join(getExtraResourcesPath(), 'assets', 'images', 'story-default-title.png'),
              description: '',
              category: '',
              age: 0
            },
            nodes: {
              startAction: {action: 'a0', index: 0},
              stages: {},
              actions: {a0: []}
            },
            notes: {}
          }
        )
      } else {
        const
          pathAudioTitle = path.join(metadataSrc.path, 'title.mp3'),
          pathImageTitle = path.join(metadataSrc.path, 'title.png'),
          pathImageCover = path.join(metadataSrc.path, 'cover.png'),
          metadata = {
            ...metadataSrc,
            audioTitle: fs.existsSync(pathAudioTitle) ? pathAudioTitle : undefined,
            imageTitle: fs.existsSync(pathImageTitle) ? pathImageTitle : undefined,
            imageCover: fs.existsSync(pathImageCover) ? pathImageCover : undefined,
          },
          nodes = checkNodes(JSON.parse(fs.readFileSync(path.join(metadata.path, 'nodes.json')).toString('utf8')))
        mainWindow.webContents.send('studio-story-data', {metadata, nodes, notes: checkNotes(metadata.path, nodes)})
      }
    }
  )

  ipcMain.on(
    'studio-story-save',
    async (event, storyData) => {
      const
        storiesPath = getStoriesPath(),
        newMetadataContent = JSON.stringify(getMetadataStory(storyData.metadata, storyData.metadata.newImageCover || storyData.metadata.imageCover ? 'cover.png' : 'title.png')),
        oldMetadataContent = storyData.metadata.path !== undefined ? fs.readFileSync(path.join(storyData.metadata.path, 'metadata.json')).toString('utf-8') : '',
        newStoryDirectory = generateDirNameStory(
          storyData.metadata.title,
          storyData.metadata.uuid,
          storyData.metadata.age,
          storyData.metadata.category
        ),
        haveToUpdateLocalStories = newMetadataContent !== oldMetadataContent,
        jsonPath = path.join(initTmpPath('json'), 'story.json')

      fs.writeFileSync(jsonPath, JSON.stringify(storyData))
      runProcess(
        path.join('Studio', 'StudioSave.js'),
        [jsonPath],
        () => {
          mainWindow.webContents.send('studio-story-save-task', '', '', 0, 0)
          ipcMain.emit('studio-story-get', event, readStoryMetadata(storiesPath, newStoryDirectory))
          haveToUpdateLocalStories && ipcMain.emit('local-stories-get')
        },
        (message, current, total) => {
          mainWindow.webContents.send('studio-story-save-task', 'story-saving', message, current, total)
        },
        (error) => {
          mainWindow.webContents.send('studio-story-save-error', 'error', error)
          mainWindow.webContents.send('studio-story-save-task', '', '', 0, 0)
        },
        () => {
        }
      )
    }
  )
}

export default mainEventStudio
