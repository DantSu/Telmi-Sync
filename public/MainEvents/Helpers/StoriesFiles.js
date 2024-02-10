import * as fs from 'fs'
import * as path from 'path'
import runProcess from '../Processes/RunProcess.js'
import { rmDirectory } from './Files.js'

const
  readStories = (storiesPath) => {
    if (!fs.existsSync(storiesPath)) {
      return []
    }
    return fs.readdirSync(storiesPath)
      .reduce(
        (acc, d) => {
          const
            storyPath = path.join(storiesPath, d),
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
            return acc
          }

          const md = JSON.parse(fs.readFileSync(mdPath).toString('utf8'))
          md.image = path.join(storiesPath, d, md.image)
          md.audio = path.join(storiesPath, d, 'title.mp3')
          return [...acc, md]
        },
        []
      )
      .sort((a, b) => a.title.localeCompare(b.title))
  },

  deleteStories = (storiesPath, storiesUuid, onFinished) => {
    if (!Array.isArray(storiesUuid)) {
      return false
    }
    runProcess(
      path.join('Stories', 'StoriesDelete.js'),
      [storiesPath, ...storiesUuid],
      () => {},
      () => {},
      () => {},
      onFinished
    )
    return true
  }

export { readStories, deleteStories }
