import * as fs from 'fs'
import * as path from 'path'

import { getProcessParams } from '../Helpers/ProcessParams.js'
import { rmFile } from '../../Helpers/Files.js'
import { convertAudios } from '../Import/Helpers/AudioFile.js'

function main (storyPath) {
  process.stdout.write('*initialize*0*1*')

  const storyAudioPath = path.join(storyPath, 'audios')

  if (!fs.existsSync(storyPath) || !fs.existsSync(storyAudioPath)) {
    process.stderr.write('story-not-found')
  }

  const
    titleFile = path.join(storyPath, 'title.mp3'),
    titleFileTmp = path.join(storyPath, 'title_tmp.mp3'),
    files = fs.readdirSync(storyAudioPath, {encoding: 'utf8'}),
    filesTmp = [...files.map((f, i) => {
      const
        srcFile = path.join(storyAudioPath, f),
        dstFile = path.join(storyAudioPath, f.substring(0, f.length - 4) + '_tmp.mp3')
      fs.renameSync(srcFile, dstFile)
      return dstFile
    }), titleFileTmp]

  fs.renameSync(titleFile, titleFileTmp)

  convertAudios(
    [...filesTmp],
    [...files.map((f) => path.join(storyAudioPath, f)), titleFile],
    0,
    filesTmp.length,
    () => {
      filesTmp.forEach((f) => rmFile(f))
      process.stdout.write('success')
    },
    true
  )
}

const _params_ = getProcessParams()

if (_params_.length === 0) {
  process.stderr.write('no-file')
} else {
  main(_params_[0])
}

