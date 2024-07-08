import * as path from 'path'
import { createPathDirectories, rmDirectory } from './Files.js'

function homePaths (homePath) {
  const
    TMP_PATH = path.join(homePath, '.telmi', 'tmp'),
    STORES_PATH = path.join(homePath, '.telmi', 'stores'),
    STORIES_PATH = path.join(homePath, '.telmi', 'stories'),
    MUSIC_PATH = path.join(homePath, '.telmi', 'music'),
    BIN_PATH = path.join(homePath, '.telmi', 'bin'),
    PARAMETERS_PATH = path.join(homePath, '.telmi', 'parameters')

  return {
    initAppPaths: () => {
      createPathDirectories(STORIES_PATH)
      createPathDirectories(MUSIC_PATH)
    },

    initTmpPath: (dirName) => {
      const dirPath = path.join(TMP_PATH, dirName)
      rmDirectory(dirPath)
      createPathDirectories(dirPath)
      return dirPath
    },

    getTmpPath: (dirName) => {
      return dirName === undefined ? TMP_PATH : path.join(TMP_PATH, dirName)
    },

    getStoriesPath: (dirStory) => {
      return dirStory === undefined ? STORIES_PATH : path.join(STORIES_PATH, dirStory)
    },

    getMusicPath: (fileAudio) => {
      return fileAudio === undefined ? MUSIC_PATH : path.join(MUSIC_PATH, fileAudio)
    },

    getBinPath: (filePath) => {
      createPathDirectories(BIN_PATH)
      return filePath === undefined ? BIN_PATH : path.join(BIN_PATH, filePath)
    },

    getStoresPath: (filePath) => {
      createPathDirectories(STORES_PATH)
      return filePath === undefined ? STORES_PATH : path.join(STORES_PATH, filePath)
    },

    getParametersPath: (filePath) => {
      createPathDirectories(PARAMETERS_PATH)
      return filePath === undefined ? PARAMETERS_PATH : path.join(PARAMETERS_PATH, filePath)
    }
  }
}

export default homePaths
