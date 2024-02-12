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

  getPathTelmiOsParameters = (drive) => {
    return path.join(drive, 'Saves/parameters.json')
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

      const version = label.substring(label.lastIndexOf(v) + v.length).split('.').map((v) => parseInt(v, 10))

      if(version.length === 3 && version[0] >= 1) {
        return {
          label: telmi,
          version: {
            major: version[0],
            minor: version[1],
            fix: version[2],
          },
          parameters: JSON.parse(fs.readFileSync(getPathTelmiOsParameters(drive)).toString('utf8'))
        }
      }
    }

    return null
  },

  saveTelmiOSParameters = (usb) => {
    fs.writeFileSync(getPathTelmiOsParameters(usb.drive), JSON.stringify(usb.telmiOS.parameters))
  }

export { parseInfFile, parseTelmiOSAutorun, saveTelmiOSParameters }
