import * as fs from 'fs'
import * as path from 'path'

import { getProcessParams } from '../Helpers/ProcessParams.js'
import { getMusicPath } from '../Helpers/AppPaths.js'

function main (dstMusicsPath, musicsIds) {
  let i = 0
  for (const musicId of musicsIds) {
    process.stdout.write('*' + musicId + '*' + (++i) + '*' + musicsIds.length + '*')

    const
      srcMusicPath = getMusicPath(musicId),
      srcMusicPathMp3 = srcMusicPath + '.mp3',
      srcMusicPathImg = srcMusicPath + '.png',
      dstMusicPath = path.join(dstMusicsPath, musicId),
      dstMusicPathMp3 = dstMusicPath + '.mp3',
      dstMusicPathImg = dstMusicPath + '.png'

    if (!fs.existsSync(srcMusicPathMp3) || !fs.existsSync(srcMusicPathImg)) {
      continue
    }

    if (fs.existsSync(dstMusicPathMp3) && fs.existsSync(dstMusicPathMp3)) {
      continue
    }

    if (fs.existsSync(dstMusicPathMp3)) {
      fs.rmSync(dstMusicPathMp3)
    }

    if (fs.existsSync(dstMusicPathImg)) {
      fs.rmSync(dstMusicPathImg)
    }

    fs.copyFileSync(srcMusicPathMp3, dstMusicPathMp3)
    fs.copyFileSync(srcMusicPathImg, dstMusicPathImg)
  }
  process.stdout.write('success')
}

const _params_ = getProcessParams()

if (_params_.length === 0) {
  process.stderr.write('no-file')
} else {
  main(_params_.shift(), _params_)
}

