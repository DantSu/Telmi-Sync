import * as fs from 'fs'
import * as path from 'path'

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

  parseTelmiOSAutorun = (dir) => {
    const pathAutorun = path.join(dir, 'autorun.inf')

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

      const version = label.substring(label.lastIndexOf(v) + v.length).split('.').map((v) => parseInt(v, 10))

      if(version.length === 3 && version[0] >= 1) {
        return {
          label: telmi,
          version: {
            major: version[0],
            minor: version[1],
            fix: version[2],
          }
        }
      }
    }

    return null
  }

export { parseInfFile, parseTelmiOSAutorun }
