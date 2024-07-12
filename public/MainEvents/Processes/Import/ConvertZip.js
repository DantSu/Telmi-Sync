import { initTmpPath } from '../Helpers/AppPaths.js'
import convertFolder from './ConvertFolder.js'
import * as path from 'path'
import { stringSlugify } from '../../Helpers/Strings.js'
import { list, unpack } from '../BinFiles/7zipCommands.js'

const
  FORMAT_UNKNOW = -1,
  FORMAT_STUDIO = 1,
  FORMAT_FS = 2,
  FORMAT_TELMI = 3,

  findDirectory = (list) => {
    const subdirectories = {}
    for (const file of list) {
      const f = path.parse(file.name)

      switch (f.base) {
        case 'li':
        case 'ni':
        case 'ri':
        case 'si':
          const keyFS = f.dir + '-' + FORMAT_FS
          if (subdirectories[keyFS] === undefined) {
            subdirectories[keyFS] = {
              dir: f.dir === '' ? null : f.dir,
              format: FORMAT_FS,
              fileCount: 1
            }
          } else {
            subdirectories[keyFS].fileCount++
          }
          break
        case 'story.json':
          subdirectories[f.dir + '-' + FORMAT_STUDIO] = {
            dir: f.dir === '' ? null : f.dir,
            format: FORMAT_STUDIO
          }
          break
        case 'metadata.json':
        case 'nodes.json':
        case 'title.mp3':
        case 'title.png':
          const keyTelmi = f.dir + '-' + FORMAT_TELMI
          if (subdirectories[keyTelmi] === undefined) {
            subdirectories[keyTelmi] = {
              dir: f.dir === '' ? null : f.dir,
              format: FORMAT_FS,
              fileCount: 1
            }
          } else {
            subdirectories[keyTelmi].fileCount++
          }
          break
        default:
      }
    }

    for (const dir of Object.values(subdirectories)) {
      if (dir.format === FORMAT_STUDIO || ((dir.format === FORMAT_FS || dir.format === FORMAT_TELMI) && dir.fileCount === 4)) {
        return [dir.format, dir.dir]
      }
    }

    return [FORMAT_UNKNOW, null]
  }

function convertZip (zipPath) {
  process.stdout.write('*zip-extract*0*1*')
  list(
    zipPath,
    (error, result) => {
      if (error) {
        process.stderr.write('zip-invalid')
        return
      }
      const [storyFormat, storyDir] = findDirectory(result)

      if (storyFormat === FORMAT_UNKNOW) {
        process.stderr.write('story-format-invalid')
        return
      }

      const
        zipFilename = path.parse(zipPath).name,
        tmpPath = storyDir === null ? initTmpPath(path.join('story-zip', stringSlugify(zipFilename))) : initTmpPath('story-zip'),
        extractPath = storyDir === null ? tmpPath : path.join(tmpPath, storyDir)

      unpack(
        zipPath,
        tmpPath,
        (error) => {
          if (error) {
            process.stderr.write('zip-invalid')
            return
          }

          process.stdout.write('*zip-extract*1*1*')
          convertFolder(extractPath, zipFilename)
        }
      )
    }
  )
}

export default convertZip
