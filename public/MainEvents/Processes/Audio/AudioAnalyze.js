import {getProcessParams} from '../Helpers/ProcessParams.js'
import {generatePcmFromMp3} from '../BinFiles/FFmpegCommand.js'

async function main(audioPath, pcmPath) {
  await generatePcmFromMp3(audioPath, pcmPath)
  process.stdout.write('success')
}

const _params_ = getProcessParams()

if (_params_.length === 0) {
  process.stderr.write('no-file')
} else {
  main(_params_[0], _params_[1])
}

