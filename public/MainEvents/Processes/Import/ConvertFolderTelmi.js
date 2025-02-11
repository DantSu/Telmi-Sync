import path from 'path'
import fs from 'fs'

import {createPathDirectories, isDirectory, rmDirectory} from '../../Helpers/Files.js'
import {getStoriesPath} from '../Helpers/AppPaths.js'
import {generateDirNameStory} from '../../Helpers/Stories.js'

function convertFolderTelmi(srcStoryPath) {
  process.stdout.write('*initialize*0*1*')

  if (!fs.existsSync(srcStoryPath)) {
    process.stderr.write('story-not-found')
  }

  const
    metadata = JSON.parse(fs.readFileSync(path.join(srcStoryPath, 'metadata.json')).toString('utf-8')),
    dstStoryPath = getStoriesPath(generateDirNameStory(metadata.title, metadata.uuid, metadata.age, metadata.category))

  rmDirectory(dstStoryPath)
  createPathDirectories(path.join(dstStoryPath, 'images'))
  createPathDirectories(path.join(dstStoryPath, 'audios'))

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

    fs.copyFileSync(srcFile, dstFile)
  }
  process.stdout.write('success')
}


export default convertFolderTelmi