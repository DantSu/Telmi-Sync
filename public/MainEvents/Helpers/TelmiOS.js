import * as path from 'path'
import * as fs from 'fs'

const
  getPathTelmiOsParameters = (drive) => {
    return path.join(drive, 'Saves/parameters.json')
  },

  readTelmiOSParameters = (usb) => {
    usb.telmiOS.parameters = JSON.parse(fs.readFileSync(getPathTelmiOsParameters(usb.drive)).toString('utf8'))
    return usb
  },

  saveTelmiOSParameters = (usb) => {
    fs.writeFileSync(getPathTelmiOsParameters(usb.drive), JSON.stringify(usb.telmiOS.parameters))
  }

export { readTelmiOSParameters, saveTelmiOSParameters }
