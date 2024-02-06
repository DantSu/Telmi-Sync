import { downloadFile } from '../../Helpers/Request.js'
import { getBinPath } from '../Helpers/AppPaths.js'
import { rmFile } from '../../Helpers/Files.js'
import * as fs from 'fs'
import { getFFmpegFilePath } from './FFmpegCommand.js'
import { unpack } from './7zipCommands.js'

const
  links = [
    'https://github.com/ffbinaries/ffbinaries-prebuilt/releases/download/v6.1/ffmpeg-6.1-win-64.zip',
    'https://github.com/ffbinaries/ffbinaries-prebuilt/releases/download/v6.1/ffmpeg-6.1-linux-64.zip',
    'https://github.com/ffbinaries/ffbinaries-prebuilt/releases/download/v6.1/ffmpeg-6.1-linux-arm-64.zip',
    'https://github.com/ffbinaries/ffbinaries-prebuilt/releases/download/v6.1/ffmpeg-6.1-macos-64.zip'
  ],
  baseUrl = 'https://github.com/ffbinaries/ffbinaries-prebuilt/releases/download/v6.1/ffmpeg-6.1-',
  getOS = () => {
    switch (process.platform) {
      case 'darwin':
        return 'macos'
      case 'linux':
        return 'linux'
      case 'win32':
        return 'win'
      default:
        return null
    }
  },
  getArch = () => {
    switch (process.arch) {
      case 'x64':
        return '64'
      case 'arm64':
        return 'arm-64'
      default:
        return null
    }
  }

function main () {
  const url = baseUrl + getOS() + '-' + getArch() + '.zip'

  if (!links.includes(url)) {
    process.stderr.write('ffmpeg-os-unsupported')
    return
  }

  const ffmpegFilePath = getFFmpegFilePath()

  if(fs.existsSync(ffmpegFilePath)) {
    process.stdout.write('success')
    return
  }

  downloadFile(
    url,
    getBinPath('ffmpeg.zip'),
    (current, total) => {
      process.stdout.write('*downloading*' + current + '*' + total + '*')
    }
  )
    .then((zipPath) => {
      unpack(
        zipPath,
        getBinPath(),
        (error) => {

            if (error) {
              process.stderr.write('ffmpeg-zip-invalid')
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
