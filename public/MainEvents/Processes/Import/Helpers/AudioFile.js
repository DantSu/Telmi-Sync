import * as path from 'path'
import * as fs from 'fs'
import {convertAudioToMp3} from '../../BinFiles/FFmpegCommand.js'
import {findFile} from '../../../Helpers/Files.js'

const
  isAudioFile = (fileName) => {
    const ext = path.extname(fileName).toLowerCase()
    return ext === '.mp3' || ext === '.webm' || ext === '.wma' || ext === '.ogg' || ext === '.flac' || ext === '.m4a' || ext === '.mp4a' || ext === '.aac' || ext === '.wav'
  },
  findAudio = (dir, fileName) => findFile(dir, fileName, ['.mp3', '.webm', '.wma', '.ogg', '.flac', '.m4a', '.mp4a', '.aac', '.wav', '.txt']),

  convertAudio = async (fromPath, toPath, forceConverting, forceVolume) => {
    await convertAudioToMp3(fromPath, toPath, forceConverting, forceVolume)
  },

  convertAudios = (srcAudios, dstAudios, index, length, onEnd, forceConverting, forceVolume) => {
    if (!srcAudios.length) {
      onEnd(index)
      return
    }

    const
      srcAudio = srcAudios.shift(),
      dstAudio = dstAudios.shift()

    process.stdout.write('*converting-audio*' + index + '*' + length + '*')

    convertAudio(srcAudio, dstAudio, forceConverting, forceVolume)
      .then(() => convertAudios(srcAudios, dstAudios, index + 1, length, onEnd, forceConverting, forceVolume))
      .catch(() => convertAudios(srcAudios, dstAudios, index + 1, length, onEnd, forceConverting, forceVolume))
  },

  checkCoverExists = (artist, album, coverPath) => {
    const
      prefix = artist + '_' + album,
      dirPath = path.dirname(coverPath),
      foundCover = fs.readdirSync(dirPath).find(
        (v) => v.substring(v.length - 4) === '.png' && v.substring(0, prefix.length) === prefix
      )

    if (foundCover === undefined) {
      return false
    }

    fs.copyFileSync(path.join(dirPath, foundCover), coverPath)
    return true
  }

export {isAudioFile, convertAudio, convertAudios, checkCoverExists, findAudio}
