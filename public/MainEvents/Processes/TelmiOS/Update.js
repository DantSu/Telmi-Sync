import { getProcessParams } from '../Helpers/ProcessParams.js'
import { downloadFile, requestJson } from '../../Helpers/Request.js'
import { parseTelmiOSAutorun } from '../../Helpers/InfFiles.js'
import { isNewerVersion } from '../../Helpers/Version.js'
import * as path from 'path'
import { initTmpPath } from '../Helpers/AppPaths.js'
import { unpack } from '../BinFiles/7zipCommands.js'

async function main (drive) {
  process.stdout.write('*initialize*0*1*')

  const telmiOS = parseTelmiOSAutorun(drive)

  if (telmiOS === null) {
    return process.stdout.write('telmios-not-found')
  }

  const json = await requestJson('https://api.github.com/repos/DantSu/Telmi-story-teller/releases', {})

  if (!json.length) {
    return process.stdout.write('success')
  }

  const lts = json[0]

  if (!isNewerVersion(telmiOS.version, lts.tag_name)) {
    return process.stdout.write('success')
  }

  for (const asset of lts.assets) {
    if (asset.name === 'TelmiOS_v' + lts.tag_name + '-update.zip') {

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
            process.stderr.write(error.toString())
            return
          }
          process.stdout.write('*zip-extract*1*1*')
          process.stdout.write('success')
        }
      )
      return
    }
  }
  process.stdout.write('success')
}

const _params_ = getProcessParams()

if (_params_.length === 0) {
  process.stderr.write('telmios-not-found')
} else {
  main(_params_[0]).catch((e) => process.stderr.write(e.toString()))
}
