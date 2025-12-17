import {getProcessParams} from '../Helpers/ProcessParams.js'
import {cropMp3} from '../BinFiles/FFmpegCommand.js'

async function main(srcPath, dstPath, startTime, endTime) {
  process.stdout.write('*audio-cropping*50*100*')
  await cropMp3(srcPath, dstPath, startTime, endTime)
  process.stdout.write('*audio-cropping*100*100*')
  process.stdout.write('success')
}

const _params_ = getProcessParams()

if (_params_.length === 0) {
  process.stderr.write('no-file')
} else {
  main(_params_[0], _params_[1], _params_[2], _params_[3])
}

