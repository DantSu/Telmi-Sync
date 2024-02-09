import * as path from 'path'
import { createPathDirectories } from './Files.js'

const
  getUsbStoriesPath = (usbPath) => {
    const storiesPath = path.join(usbPath, 'Stories')
    createPathDirectories(storiesPath)
    return storiesPath
  },
  getUsbMusicPath = (usbPath) => {
    const musicPath = path.join(usbPath, 'Music')
    createPathDirectories(musicPath)
    return musicPath
  }

export { getUsbMusicPath, getUsbStoriesPath }
