import * as fs from 'fs'
import * as path from 'path'

import { getProcessParams } from '../Helpers/ProcessParams.js'
import { getMusicPath } from '../Helpers/AppPaths.js'

function main (dstMusicsPath, musicId) {
  process.stdout.write('*initialize*0*1*')

  const
    srcMusicPath = getMusicPath(musicId),
    srcMusicPathMp3 = srcMusicPath + '.mp3',
    srcMusicPathImg = srcMusicPath + '.png',
    dstMusicPath = path.join(dstMusicsPath, musicId),
    dstMusicPathMp3 = dstMusicPath + '.mp3',
    dstMusicPathImg = dstMusicPath + '.png'

  if (!fs.existsSync(srcMusicPathMp3) || !fs.existsSync(srcMusicPathImg)) {
    process.stderr.write('music-not-found')
  }

  if(fs.existsSync(dstMusicPathMp3) && fs.existsSync(dstMusicPathMp3)) {
    return process.stdout.write('success')
  }

  if(fs.existsSync(dstMusicPathMp3)) {
    fs.rmSync(dstMusicPathMp3)
  }

  if(fs.existsSync(dstMusicPathImg)) {
    fs.rmSync(dstMusicPathImg)
  }

  process.stdout.write('*transferring-files*0*2*')
  fs.copyFileSync(srcMusicPathMp3, dstMusicPathMp3)
  process.stdout.write('*transferring-files*1*2*')
  fs.copyFileSync(srcMusicPathImg, dstMusicPathImg)
  process.stdout.write('success')
}

const _params_ = getProcessParams()

if (_params_.length === 0) {
  process.stderr.write('no-file')
} else {
  main(_params_[0], _params_[1])
}

