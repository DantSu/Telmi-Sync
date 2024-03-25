import { downloadFile } from '../../Helpers/Request.js'
import { initTmpPath } from '../Helpers/AppPaths.js'
import { getProcessParams } from '../Helpers/ProcessParams.js'
import * as path from 'path'
import convertZip from '../Import/ConvertZip.js'

function main (url) {

  const downloadPath = path.join(initTmpPath('download'), 'tmp.zip')

  downloadFile(
    url,
    downloadPath,
    (current, total) => {
      process.stdout.write('*story-download*' + current + '*' + total + '*')
    }
  )
    .then((zipPath) => convertZip(zipPath))
    .catch(() => {
      process.stderr.write('store-download-failed')
    })
}

const _params_ = getProcessParams()

if (_params_.length === 0) {
  process.stderr.write('no-file')
} else {
  main(_params_[0])
}
