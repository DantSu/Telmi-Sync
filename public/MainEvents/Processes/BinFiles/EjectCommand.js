import {spawn} from 'child_process'
import {getExtraResourcesPath} from '../Helpers/AppPaths.js'
import * as path from 'path'

const
  getEjectFileName = () => {
    return process.platform === 'win32' ? 'eject.bat' : 'eject.sh'
  },

  getEjectFilePath = () => {
    return path.join(getExtraResourcesPath(), 'eject', process.platform, getEjectFileName())
  },

  pathEject = getEjectFilePath(),

  spawnEject = (drive) => {
    return process.platform === 'win32' ?
      spawn('cmd.exe', ['/c', pathEject, drive]) :
      spawn(pathEject, [drive])
  },

  ejectDrive = (drive) => {
    return new Promise((resolve, reject) => {
      try {
        const stream = spawnEject(drive)
        stream.on('close', (code) => {
          if (code === 0) {
            resolve()
          } else {
            reject()
          }
        })
      } catch (e) {
        process.stdout.write('*' + e.toString() + '*0*1*')
        reject()
      }
    })
  }

export {ejectDrive}
