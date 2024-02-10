import * as fs from 'fs'
import * as path from 'path'
import runProcess from '../Processes/RunProcess.js'

const
  readStories = (storiesPath) => {
    if(!fs.existsSync(storiesPath)) {
      return []
    }
    return fs.readdirSync(storiesPath)
      .map((d) => {
        const md = JSON.parse(fs.readFileSync(path.join(storiesPath, d, 'metadata.json')).toString('utf8'))
        md.image = path.join(storiesPath, d, md.image)
        md.audio = path.join(storiesPath, d, 'title.mp3')
        return md
      })
      .sort((a, b) => a.title.localeCompare(b.title))
  },

  deleteStories = (storiesPath, storiesUuid, onEnd) => {
    if (!Array.isArray(storiesUuid)) {
      return false
    }
    runProcess(
      path.join('Stories', 'StoriesDelete.js'),
      [storiesPath, ...storiesUuid],
      onEnd,
      (message, current, total) => {},
      onEnd
    )
    return true
  }

export { readStories, deleteStories }
