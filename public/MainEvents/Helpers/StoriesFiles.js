import * as fs from 'fs'
import * as path from 'path'
import runProcess from '../Processes/RunProcess.js'
import {rmDirectory} from './Files.js'
import {generateDirNameStory} from './Stories.js'

const
  readStoryMetadata = (storiesPath, directory) => {
    const
      storyPath = path.join(storiesPath, directory),
      nodesPath = path.join(storyPath, 'nodes.json'),
      mdPath = path.join(storyPath, 'metadata.json'),
      mp3Path = path.join(storyPath, 'title.mp3'),
      pngPath = path.join(storyPath, 'title.png'),
      audiosPath = path.join(storyPath, 'audios'),
      imagesPath = path.join(storyPath, 'images')

    if (
      !fs.existsSync(nodesPath) || !fs.existsSync(mdPath) || !fs.existsSync(mp3Path) ||
      !fs.existsSync(pngPath) || !fs.existsSync(audiosPath) || !fs.existsSync(imagesPath)
    ) {
      rmDirectory(storyPath)
      return null
    }

    const
      md = JSON.parse(fs.readFileSync(mdPath).toString('utf8')),
      storyDirName = generateDirNameStory(md.title, md.uuid, md.age, md.category)

    if (storyDirName !== directory) {
      const newStoryPath = path.join(storiesPath, storyDirName)
      rmDirectory(newStoryPath)
      fs.renameSync(storyPath, newStoryPath)
      directory = storyDirName
    }

    md.directory = directory
    md.path = path.join(storiesPath, directory)
    md.image = path.join(md.path, md.image)
    md.audio = path.join(md.path, 'title.mp3')
    return md
  },
  readStories = (storiesPath) => {
    if (!fs.existsSync(storiesPath)) {
      return []
    }
    return fs.readdirSync(storiesPath)
      .reduce(
        (acc, d) => {
          const md = readStoryMetadata(storiesPath, d)
          return md !== null ? [...acc, md] : acc
        },
        []
      )
      .sort((md1, md2) => md1.directory > md2.directory ? 1 : (md1.directory < md2.directory ? -1 : 0))
  },

  deleteStories = (storiesPath, onFinished) => {
    if (!Array.isArray(storiesPath)) {
      return false
    }
    runProcess(
      path.join('Stories', 'StoriesDelete.js'),
      storiesPath,
      () => {
      },
      () => {
      },
      () => {
      },
      onFinished
    )
    return true
  }

export {readStories, readStoryMetadata, deleteStories}
