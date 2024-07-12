import * as fs from 'fs'
import * as path from 'path'
import convertFolderSTUdio from './ConvertFolderSTUdio.js'
import convertFolderFS from './ConvertFolderFS.js'
import convertFolderTelmi from './ConvertFolderTelmi.js'

const
  FORMAT_UNKNOW = -1,
  FORMAT_STUDIO = 1,
  FORMAT_FS = 2,
  FORMAT_TELMI = 3,

  hasDirectory = (parentPath, dirName) => {
    const dirPath = path.join(parentPath, dirName)
    return fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory()
  },

  hasFile = (parentPath, fileName) => {
    const filePath = path.join(parentPath, fileName)
    return fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()
  },

  storyFormatDetector = (path) => {
    if (
      hasDirectory(path, 'assets') &&
      hasFile(path, 'story.json')
    ) {
      return FORMAT_STUDIO
    }

    if (
      hasDirectory(path, 'rf') &&
      hasDirectory(path, 'sf') &&
      hasFile(path, 'li') &&
      hasFile(path, 'ni') &&
      hasFile(path, 'ri') &&
      hasFile(path, 'si')
    ) {
      return FORMAT_FS
    }

    if (
      hasDirectory(path, 'audios') &&
      hasDirectory(path, 'images') &&
      hasFile(path, 'metadata.json') &&
      hasFile(path, 'nodes.json') &&
      hasFile(path, 'title.mp3') &&
      hasFile(path, 'title.png')
    ) {
      return FORMAT_TELMI
    }

    return FORMAT_UNKNOW
  }

function convertFolder (storyPath, storyName) {
  const storyFormat = storyFormatDetector(storyPath)

  switch (storyFormat) {
    case FORMAT_STUDIO:
      convertFolderSTUdio(storyPath, storyName)
      break
    case FORMAT_FS:
      convertFolderFS(storyPath, storyName)
      break
    case FORMAT_TELMI:
      convertFolderTelmi(storyPath)
      break
    default:
      process.stderr.write('story-format-invalid')
  }
}

export default convertFolder
