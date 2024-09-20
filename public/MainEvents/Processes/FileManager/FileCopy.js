import {getProcessParams} from '../Helpers/ProcessParams.js'
import fs from 'fs'

function main(srcFile, dstFile) {
  process.stdout.write('*waiting*0*1*')
  fs.copyFileSync(srcFile, dstFile)
  process.stdout.write('success')
}

const _params_ = getProcessParams()

if (_params_.length < 2) {
  process.stderr.write('no-file')
} else {
  main(_params_.shift(), _params_.shift())
}

