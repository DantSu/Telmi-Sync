import * as path from 'path'
import { convertAudioToMp3 } from '../../BinFiles/FFmpegCommand.js'
import * as fs from 'fs'

const
  isAudioFile = (fileName) => {
    const ext = path.extname(fileName).toLowerCase()
    return ext === '.mp3' || ext === '.ogg' || ext === '.flac' || ext === '.wav' || ext === '.aac'
  },

  convertAudio = async (fromPath, toPath) => {
    await convertAudioToMp3(fromPath, toPath)
  },

  convertAudios = (srcAudios, dstAudios, index, length, onEnd) => {
    if (!srcAudios.length) {
      onEnd(index)
      return
    }

    const
      srcAudio = srcAudios.shift(),
      dstAudio = dstAudios.shift()

    process.stdout.write('*converting-audio*' + index + '*' + length + '*')

    convertAudio(srcAudio, dstAudio)
      .then(() => convertAudios(srcAudios, dstAudios, index + 1, length, onEnd))
      .catch(() => convertAudios(srcAudios, dstAudios, index + 1, length, onEnd))
  },

  checkCoverExists = (artist, album, coverPath) => {
    const
      prefix = artist + '_' + album,
      dirPath = path.dirname(coverPath),
      findedCover = fs.readdirSync(dirPath).find(
        (v) => v.substring(v.length - 4) === '.png' && v.substring(0, prefix.length) === prefix
      )

    if (findedCover === undefined) {
      return false
    }

    fs.copyFileSync(path.join(dirPath, findedCover), coverPath)
    return true
  }

export { isAudioFile, convertAudio, convertAudios, checkCoverExists }
