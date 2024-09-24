import {initTmpPath} from '../Helpers/AppPaths.js'
import convertFolder from './ConvertFolder.js'
import * as path from 'path'
import {stringSlugify} from '../../Helpers/Strings.js'
import {list, unpack} from '../BinFiles/7zipCommands.js'

const
  FORMAT_UNKNOW = -1,
  FORMAT_STUDIO = 1,
  FORMAT_FS = 2,
  FORMAT_TELMI = 3,
  FORMAT_STORYPACK = 4,

  findDirectory = (list) => {
    const
      subdirectories = {},
      setSubdirectory = (format, dir) => {
        const key = dir + '-' + format
        if (subdirectories[key] === undefined) {
          subdirectories[key] = {
            dir: dir === '' ? null : dir,
            format,
            fileCount: 1
          }
        } else {
          subdirectories[key].fileCount++
        }
      }
    for (const file of list) {
      const f = path.parse(file.name)
      switch (f.base) {
        case 'li':
        case 'ni':
        case 'ri':
        case 'si':
          setSubdirectory(FORMAT_FS, f.dir)
          break
        case 'story.json':
          setSubdirectory(FORMAT_STUDIO, f.dir)
          break
        case 'metadata.json':
        case 'nodes.json':
        case 'title.mp3':
        case 'title.png':
          setSubdirectory(FORMAT_TELMI, f.dir)
          break
        case 'main-title.mp3':
        case 'main-title.ogg':
        case 'main-title.flac':
        case 'main-title.m4a':
        case 'main-title.mp4a':
        case 'main-title.aac':
        case 'main-title.wav':
        case 'main-title.wma':
        case 'main-title.webm':
        case 'main-title.jpg':
        case 'main-title.jpeg':
        case 'main-title.gif':
        case 'main-title.png':
        case 'main-title.avif':
        case 'main-title.webp':
          setSubdirectory(FORMAT_STORYPACK, f.dir)
          break
        default:
      }
    }

    for (const dir of Object.values(subdirectories)) {
      if (
        dir.format === FORMAT_STUDIO ||
        ((dir.format === FORMAT_FS || dir.format === FORMAT_TELMI) && dir.fileCount === 4) ||
        (dir.format === FORMAT_STORYPACK && dir.fileCount === 2)
      ) {
        return [dir.format, dir.dir]
      }
    }

    return [FORMAT_UNKNOW, null]
  }

function convertZip(zipPath) {
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
