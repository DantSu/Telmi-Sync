import * as path from 'path'
import { createPathDirectories } from './Files.js'

const
  getTelmiOSStoriesPath = (usbPath) => {
    const storiesPath = path.join(usbPath, 'Stories')
    createPathDirectories(storiesPath)
    return storiesPath
  },
  getTelmiOSMusicPath = (usbPath) => {
    const musicPath = path.join(usbPath, 'Music')
    createPathDirectories(musicPath)
    return musicPath
  }

export { getTelmiOSMusicPath, getTelmiOSStoriesPath }
