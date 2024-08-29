import * as fs from 'fs'
import path from 'path'

import {getProcessParams} from '../Helpers/ProcessParams.js'
import {getExtraResourcesPath} from '../Helpers/AppPaths.js'
import {convertMusicImage} from '../Import/Helpers/ImageFile.js'


function main(srcPath, dstPath) {
  const stepCopyDefaultCover = () => {
    fs.copyFileSync(path.join(getExtraResourcesPath(), 'assets', 'images', 'unknow-album.png'), dstPath)
    process.stdout.write('success')
  }

  convertMusicImage(srcPath, dstPath)
    .then(() => {
      if (!fs.existsSync(dstPath)) {
        return stepCopyDefaultCover()
      }
      process.stdout.write('success')
    })
    .catch(stepCopyDefaultCover)
}

const _params_ = getProcessParams()

if (_params_.length === 0) {
  process.stderr.write('no-file')
} else {
  main(_params_[0], _params_[1])
}

