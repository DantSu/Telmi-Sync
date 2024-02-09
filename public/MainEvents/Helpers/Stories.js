import * as fs from 'fs'
import * as path from 'path'
import { rmDirectory } from './Files.js'

const
  readStories = (storiesPath) => {
    return fs.readdirSync(storiesPath)
      .map((d) => {
        const md = JSON.parse(fs.readFileSync(path.join(storiesPath, d, 'metadata.json')).toString('utf8'))
        md.image = path.join(storiesPath, d, md.image)
        md.audio = path.join(storiesPath, d, 'title.mp3')
        return md
      })
      .sort((a, b) => a.title.localeCompare(b.title))
  },

  deleteStories = (storiesPath, storiesUuid) => {
    if (!Array.isArray(storiesUuid)) {
      return false
    }

    for (const storyUuid of storiesUuid) {
      if (typeof storyUuid === 'string' && storyUuid !== '') {
        rmDirectory(path.join(storiesPath, storyUuid))
      }
    }
    return true
  }

export { readStories, deleteStories }
