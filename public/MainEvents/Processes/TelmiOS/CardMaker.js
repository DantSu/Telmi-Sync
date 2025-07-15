import sudo from '@expo/sudo-prompt'
import path from 'path'
import {getProcessParams} from '../Helpers/ProcessParams.js'
import {getExtraResourcesPath, initTmpPath} from '../Helpers/AppPaths.js'
import {downloadFile, requestJson} from '../../Helpers/Request.js'
import {unpack} from '../BinFiles/7zipCommands.js'

const
  getCommand = (drive) => {
    switch (process.platform) {
      case 'win32':
        return 'CALL "' + path.join(getExtraResourcesPath(), 'fat32', process.platform, 'format.bat') + '" ' + drive.substring(0, drive.indexOf(':'))
      case 'darwin':
      case 'linux':
        return '"' + path.join(getExtraResourcesPath(), 'fat32', process.platform, 'format.sh') + '" "' + drive + '"'
      default:
        return null
    }
  }

async function main(drive) {
  process.stdout.write('*formatting*0*1*')
  sudo.exec(
    getCommand(drive),
    {name: 'Telmi Sync'},
    async function (error, stdout, stderr) {
      if (error) {
        process.stderr.write(error.toString())
        return
      }
      if (stderr) {
        process.stderr.write(stderr)
        return
      }

      const json = await requestJson('https://api.github.com/repos/DantSu/Telmi-story-teller/releases', {})

      if (!json.length) {
        return process.stdout.write('success')
      }

      const lts = json[0]

      for (const asset of lts.assets) {
        if (asset.name === 'TelmiOS_v' + lts.tag_name + '.zip') {
          const zipPath = await downloadFile(
            asset.browser_download_url,
            path.join(initTmpPath('download'), 'tmp.zip'),
            (current, total) => {
              process.stdout.write('*downloading-files*' + current + '*' + total + '*')
            }
          )

          process.stdout.write('*zip-extract*0*1*')

          unpack(
            zipPath,
            drive,
            (error) => {
              if (error) {
                process.stderr.write('zip-invalid')
                return
              }
              process.stdout.write('*zip-extract*1*1*')
              process.stdout.write('success')
            }
          )
          return
        }
      }
      process.stderr.write('telmios-download-error')
    }
  )
}

const _params_ = getProcessParams()

if (_params_.length === 0) {
  process.stderr.write('device-not-found')
} else {
  main(_params_[0]).catch((e) => process.stderr.write(e.toString()))
}
