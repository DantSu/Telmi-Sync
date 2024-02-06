import * as path from 'path'
import { convertAudioToMp3 } from '../../BinFiles/FFmpegCommand.js'

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

    process.stdout.write('*' + path.basename(srcAudio) + '*' + index + '*' + length + '*')

    convertAudio(srcAudio, dstAudio)
      .then(() => convertAudios(srcAudios, dstAudios, index + 1, length, onEnd))
      .catch(() => convertAudios(srcAudios, dstAudios, index + 1, length, onEnd))
  }

export { isAudioFile, convertAudio, convertAudios}
