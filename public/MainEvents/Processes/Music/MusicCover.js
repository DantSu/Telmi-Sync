import * as fs from 'fs'
import * as path from 'path'
import * as url from 'url'

import { getProcessParams } from '../Helpers/ProcessParams.js'
import { getMusicPath, initTmpPath } from '../Helpers/AppPaths.js'
import { getMusicBrainzCoverImage } from '../Helpers/MusicBrainzApi.js'
import { convertMusicImage } from '../Import/Helpers/ImageFile.js'
import { musicNameToObject } from '../../Helpers/Music.js'
import { checkCoverExists } from '../Import/Helpers/AudioFile.js'

const
  __dirname = url.fileURLToPath(new URL('.', import.meta.url)),
  end = () => process.stdout.write('success')

function main (musicName) {
  const
    filePath = path.join(getMusicPath(), musicName),
    musicPath = filePath + '.mp3',
    imagePath = filePath + '.png',

    stepCopyDefaultCover = () => {
      fs.copyFileSync(path.join(__dirname, '..', 'Assets', 'Images', 'unknow-album.png'), imagePath)
      process.stdout.write('success')
    }

  if (!fs.existsSync(musicPath)) {
    process.stderr.write('file-not-found')
    return
  }

  if (fs.existsSync(imagePath)) {
    fs.rmSync(imagePath)
  }

  const metadata = musicNameToObject(musicName)

  if (metadata.artist === 'unknow' || metadata.album === 'unknow') {
    return
  }
  const tmpPath = initTmpPath('music')

  if (checkCoverExists(metadata.artist, metadata.album, imagePath)) {
    return end()
  }

  getMusicBrainzCoverImage(metadata.artist, metadata.album, tmpPath)
    .then((pathFile) => {
      if (fs.existsSync(imagePath)) {
        fs.rmSync(imagePath)
      }
      convertMusicImage(pathFile, imagePath)
        .then(() => {
          if (!fs.existsSync(imagePath)) {
            return stepCopyDefaultCover()
          }
          end()
        })
        .catch(stepCopyDefaultCover)
    })
    .catch(end)
}

const _params_ = getProcessParams()

if (_params_.length === 0) {
  process.stderr.write('no-file')
} else {
  main(_params_[0])
}

