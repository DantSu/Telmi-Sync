import * as fs from 'fs'
import * as path from 'path'

import { getProcessParams } from '../Helpers/ProcessParams.js'

function main (musicsPath, musicsIds) {
  process.stdout.write('*initialize*0*1*')

  let i = 0
  for (const musicId of musicsIds) {
    process.stdout.write('*musics-deleting*' + (++i) + '*' + musicsIds.length + '*')

    const
      musicPath = path.join(musicsPath, musicId),
      musicPathMp3 = musicPath + '.mp3',
      musicPathImg = musicPath + '.png'

    if (fs.existsSync(musicPathMp3)) {
      fs.rmSync(musicPathMp3)
    }

    if (fs.existsSync(musicPathImg)) {
      fs.rmSync(musicPathImg)
    }
  }
  process.stdout.write('success')
}

const _params_ = getProcessParams()

if (_params_.length === 0) {
  process.stderr.write('no-file')
} else {
  main(_params_.shift(), _params_)
}

