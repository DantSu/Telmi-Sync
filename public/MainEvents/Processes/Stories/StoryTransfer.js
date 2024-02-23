import * as fs from 'fs'
import * as path from 'path'

import { getProcessParams } from '../Helpers/ProcessParams.js'
import { createPathDirectories, isDirectory, rmDirectory } from '../../Helpers/Files.js'

function main (dstStoriesPath, srcStoryPath) {
  process.stdout.write('*initialize*0*1*')

  const dstStoryPath = path.join(dstStoriesPath, path.basename(srcStoryPath))

  if (!fs.existsSync(srcStoryPath)) {
    process.stderr.write('story-not-found')
  }

  rmDirectory(dstStoryPath)

  const files = fs.readdirSync(srcStoryPath, {encoding: 'utf8', recursive: true})

  let i = 0
  for (const file of files) {
    process.stdout.write('*transferring-files*' + (i++) + '*' + files.length + '*')

    const
      srcFile = path.join(srcStoryPath, file),
      dstFile = path.join(dstStoryPath, file)

    if (isDirectory(srcFile)) {
      continue
    }

    createPathDirectories(path.dirname(dstFile))
    fs.copyFileSync(srcFile, dstFile)
  }
  process.stdout.write('success')
}

const _params_ = getProcessParams()

if (_params_.length === 0) {
  process.stderr.write('no-file')
} else {
  main(_params_[0], _params_[1])
}

