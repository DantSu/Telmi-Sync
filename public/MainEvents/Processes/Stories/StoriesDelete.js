import { getProcessParams } from '../Helpers/ProcessParams.js'
import { rmDirectory } from '../../Helpers/Files.js'

function main (storiesPath) {
  process.stdout.write('*initialize*0*1*')

  let i = 0
  for (const storyPath of storiesPath) {
    process.stdout.write('*stories-deleting*' + (++i) + '*' + storiesPath.length + '*')
    rmDirectory(storyPath)
  }

  process.stdout.write('success')
}

const _params_ = getProcessParams()

if (_params_.length === 0) {
  process.stderr.write('no-file')
} else {
  main(_params_)
}

