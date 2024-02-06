import { downloadFile } from '../../Helpers/Request.js'
import { getBinPath, initTmpPath } from '../Helpers/AppPaths.js'
import { rmFile } from '../../Helpers/Files.js'
import * as fs from 'fs'
import { getProcessParams } from '../Helpers/ProcessParams.js'
import * as path from 'path'
import convertZip from '../Import/ConvertZip.js'

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

function main (url) {

  const downloadPath = path.join(initTmpPath('download'), 'tmp.zip')

  downloadFile(
    url,
    downloadPath,
    (current, total) => {
      process.stdout.write('*downloading*' + current + '*' + total + '*')
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
