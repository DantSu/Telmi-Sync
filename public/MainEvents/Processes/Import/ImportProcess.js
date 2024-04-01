import * as fs from 'fs'
import * as path from 'path'

import { getProcessParams } from '../Helpers/ProcessParams.js'
import { initAppPaths } from '../Helpers/AppPaths.js'
import convertMusic from './ConvertMusic.js'
import convertZip from './ConvertZip.js'
import convertFolder from './ConvertFolder.js'

function main (srcPath) {
  initAppPaths()
  if (!fs.existsSync(srcPath)) {
    process.stderr.write('file-not-found')
    return
  }

  if (fs.lstatSync(srcPath).isDirectory()) {
    convertFolder(srcPath)
  } else {
    switch (path.extname(srcPath).toLowerCase()) {
      case '.zip':
      case '.7z':
        convertZip(srcPath)
        break
      case '.mp3':
      case '.flac':
      case '.aac':
      case '.ogg':
      case '.wav':
      case '.mp4a':
      case '.m4a':
      case '.wma':
        convertMusic(srcPath)
        break
      default:
        process.stderr.write('file-ext-not-supported')
    }
  }
}

const _params_ = getProcessParams()

if (_params_.length === 0) {
  process.stderr.write('no-file')
} else {
  main(_params_[0])
}

