import {getProcessParams} from '../Helpers/ProcessParams.js'
import {amplifyMp3} from '../BinFiles/FFmpegCommand.js'

async function main(srcPath, dstPath, decibel) {
  process.stdout.write('*audio-amplifying*50*100*')
  await amplifyMp3(srcPath, dstPath, decibel)
  process.stdout.write('*audio-amplifying*100*100*')
  process.stdout.write('success')
}

const _params_ = getProcessParams()

if (_params_.length === 0) {
  process.stderr.write('no-file')
} else {
  main(_params_[0], _params_[1], _params_[2])
}

