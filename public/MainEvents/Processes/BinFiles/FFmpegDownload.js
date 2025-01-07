import { downloadFile } from '../../Helpers/Request.js'
import { getBinPath } from '../Helpers/AppPaths.js'
import { rmFile } from '../../Helpers/Files.js'
import * as fs from 'fs'
import { getFFmpegFilePath } from './FFmpegCommand.js'
import { unpack } from './7zipCommands.js'

const
  links = {
    'win32-x64': 'https://github.com/DantSu/ffmpeg-binaries/releases/download/6.1.0/ffmpeg-6.1-win-64.zip',
    'linux-x64': 'https://github.com/DantSu/ffmpeg-binaries/releases/download/6.1.0/ffmpeg-6.1-linux-64.zip',
    'linux-arm64': 'https://github.com/DantSu/ffmpeg-binaries/releases/download/6.1.0/ffmpeg-6.1-linux-arm-64.zip',
    'darwin-arm64': 'https://github.com/DantSu/ffmpeg-binaries/releases/download/6.1.0/ffmpeg-6.1-macos-arm-64.zip',
    'darwin-x64': 'https://github.com/DantSu/ffmpeg-binaries/releases/download/6.1.0/ffmpeg-6.1-macos-64.zip',
  }

function main () {

  const url = links[process.platform + '-' + process.arch]

  if (url === undefined) {
    process.stderr.write('os-not-supported')
    return
  }

  const ffmpegFilePath = getFFmpegFilePath()

  if (fs.existsSync(ffmpegFilePath)) {
    process.stdout.write('success')
    return
  }

  downloadFile(
    url,
    getBinPath('ffmpeg.zip'),
    (current, total) => {
      process.stdout.write('*ffmpeg-download*' + current + '*' + total + '*')
    }
  )
    .then((zipPath) => {
      unpack(
        zipPath,
        getBinPath(),
        (error) => {

          if (error) {
            process.stderr.write('zip-invalid')
            return
          }

          rmFile(zipPath)
          process.stdout.write('success')
        }
      )
    })
    .catch(() => {
      process.stderr.write('ffmpeg-download-failed')
    })
}

main()
