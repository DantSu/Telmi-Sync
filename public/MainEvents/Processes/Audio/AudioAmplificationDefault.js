import fs from 'fs'
import {getProcessParams} from '../Helpers/ProcessParams.js'
import {getAudioInfos} from '../BinFiles/FFmpegCommand.js'

async function main(audioPath, valuePath) {
  const amplificationDefault = await getAudioInfos(audioPath)
  fs.writeFileSync(valuePath, amplificationDefault[1].toFixed(2))
  process.stdout.write('success')
}

const _params_ = getProcessParams()

if (_params_.length === 0) {
  process.stderr.write('no-file')
} else {
  main(_params_[0], _params_[1])
}

