import * as fs from 'fs'

import {getProcessParams} from '../Helpers/ProcessParams.js'
import {initTmpPath} from '../Helpers/AppPaths.js'
import {getMusicBrainzCoverImage} from '../Helpers/MusicBrainzApi.js'


function main(imagePath, artist, album) {
  process.stdout.write('*music-searching-cover*0*1*')

  if (fs.existsSync(imagePath)) {
    fs.rmSync(imagePath)
  }

  if (artist === 'unknow' || album === 'unknow') {
    process.stderr.write('album-not-found')
    return
  }
  const tmpPath = initTmpPath('music')

  getMusicBrainzCoverImage(artist, album, tmpPath)
    .then((pathFile) => {
      if (!fs.existsSync(pathFile)) {
        process.stderr.write('album-not-found')
        return
      }
      fs.renameSync(pathFile, imagePath)
      process.stdout.write('success')
    })
    .catch(() => process.stderr.write('album-not-found'))
}

const _params_ = getProcessParams()

if (_params_.length === 0) {
  process.stderr.write('no-file')
} else {
  main(_params_[0], _params_[1], _params_[2])
}

