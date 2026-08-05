import * as path from 'path'
import * as fs from 'fs'
import {convertAudioToMp3} from '../../BinFiles/FFmpegCommand.js'
import {findFile} from '../../../Helpers/Files.js'
import {runConcurrentPool} from '../../../Helpers/ConcurrencyPool.js'

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
    const total = srcAudios.length
    if (!total) {
      onEnd(index)
      return
    }

    runConcurrentPool(
      total,
      (i) => convertAudio(srcAudios[i], dstAudios[i], forceConverting, forceVolume),
      (settledCount) => process.stdout.write('*converting-audio*' + (index + settledCount) + '*' + length + '*')
    ).then(() => onEnd(index + total))
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
