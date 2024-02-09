import * as path from 'path'

import { getProcessParams } from '../Helpers/ProcessParams.js'
import { rmDirectory } from '../../Helpers/Files.js'

function main (storiesPath, storiesUuids) {
  process.stdout.write('*initialize*0*1*')

  let i = 0
  for (const storyUuid of storiesUuids) {
    process.stdout.write('*stories-deleting*' + (++i) + '*' + storiesUuids.length + '*')
    rmDirectory(path.join(storiesPath, storyUuid))
  }

  process.stdout.write('success')
}

const _params_ = getProcessParams()

if (_params_.length === 0) {
  process.stderr.write('no-file')
} else {
  main(_params_.shift(), _params_)
}

