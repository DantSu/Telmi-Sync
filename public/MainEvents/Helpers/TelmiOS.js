import * as path from 'path'
import * as fs from 'fs'

const
  getPathTelmiOsParameters = (drive) => {
    return path.join(drive, 'Saves/.parameters')
  },

  readTelmiOSParameters = (telmiDevice) => {
    telmiDevice.telmiOS.parameters = JSON.parse(fs.readFileSync(getPathTelmiOsParameters(telmiDevice.drive)).toString('utf8'))
    return telmiDevice
  },

  saveTelmiOSParameters = (telmiDevice) => {
    fs.writeFileSync(getPathTelmiOsParameters(telmiDevice.drive), JSON.stringify(telmiDevice.telmiOS.parameters))
  }

export { readTelmiOSParameters, saveTelmiOSParameters }
