import {getProcessParams} from '../Helpers/ProcessParams.js'
import {
  audioRemoveUnselectedTime,
  audioRemoveSelectedTime,
  audioMuteSelectedTime,
  audioMuteUnselectedTime
} from '../BinFiles/FFmpegCommand.js'

const functions = {audioRemoveSelectedTime, audioRemoveUnselectedTime, audioMuteSelectedTime, audioMuteUnselectedTime}

async function main(srcPath, dstPath, audioFunction, startTime, endTime) {
  process.stdout.write('*audio-editing-segment*50*100*')
  await functions[audioFunction](srcPath, dstPath, startTime, endTime)
  process.stdout.write('*audio-editing-segment*100*100*')
  process.stdout.write('success')
}

const _params_ = getProcessParams()

if (_params_.length === 0) {
  process.stderr.write('no-file')
} else {
  main(_params_[0], _params_[1], _params_[2], _params_[3], _params_[4])
}

