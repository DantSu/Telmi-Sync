import {getProcessParams} from '../Helpers/ProcessParams.js'
import {pack} from '../BinFiles/7zipCommands.js'


function main(filepath, storyPath) {
  pack(
    storyPath,
    filepath,
    (e) => {
      if (e) {
        process.stderr.write(e.toString())
      } else {
        process.stdout.write('success')
      }
    }
  )
}

const _params_ = getProcessParams()

if (_params_.length !== 2) {
  process.stderr.write('zip-error')
} else {
  main(_params_.shift(), _params_.shift())
}
