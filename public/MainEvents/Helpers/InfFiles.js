import * as fs from 'fs'
import * as path from 'path'
import { versionStringToObject } from './Version.js'

const
  parseInfFile = (str) => {
    return str
      .split('\n')
      .reduce(
        (acc, v) => {
          const a = v.split('=', 2)
          if (a[1] === undefined) {
            return acc
          }
          return {...acc, [a[0].trim().toLowerCase()]: a[1].trim()}
        },
        {}
      )
  },

  parseTelmiOSAutorun = (drive) => {
    const pathAutorun = path.join(drive, 'autorun.inf')

    if (!fs.existsSync(pathAutorun)) {
      return null
    }

    const autorun = parseInfFile(fs.readFileSync(pathAutorun).toString('utf8'))

    if (autorun.label === undefined) {
      return null
    }

    const
      label = autorun.label,
      telmi = 'TelmiOS',
      v = '-v'

    if (label.substring(0, telmi.length) === telmi) {

      const version = versionStringToObject(label.substring(label.lastIndexOf(v) + v.length))

      if(version !== null && version.major >= 1) {
        return {
          label: telmi,
          version
        }
      }
    }

    return null
  }

export { parseInfFile, parseTelmiOSAutorun }
