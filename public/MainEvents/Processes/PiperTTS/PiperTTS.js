import {getProcessParams} from '../Helpers/ProcessParams.js'
import {piperTTS} from '../BinFiles/PiperTTSCommand.js'
import {getTelmiSyncParams} from '../Helpers/TelmiSyncParams.js'

function main(jsonPath) {
  process.stdout.write('*converting-audio*0*1*')

  const params = getTelmiSyncParams()

  piperTTS(jsonPath, params.piper.voice, params.piper.speaker)
    .then(() => {
      process.stdout.write('*converting-audio*1*1*')
      process.stdout.write('success')
    })
    .catch((e) => process.stderr.write(e.toString()))
}

const _params_ = getProcessParams()

if (_params_.length === 0) {
  process.stderr.write('no-file')
} else {
  main(_params_.shift())
}

