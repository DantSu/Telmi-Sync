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

  ejectDrive = (drive) => {
    return new Promise((resolve, reject) => {
      const stream = spawn(pathEject, [drive])
      stream.on('close', (code) => {
        if (code === 0) {
          resolve()
        } else {
          reject()
        }
      })
    })
  }

export {ejectDrive}
