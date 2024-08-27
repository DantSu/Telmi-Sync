import * as path from 'path'
import * as fs from 'fs'

const
  getPathTelmiOsParameters = (drive) => {
    return path.join(drive, 'Saves/.parameters')
  },
  getPathTelmiOsFlashLogo = (drive) => {
    return path.join(drive, 'Saves/.flashLogo')
  },

  readTelmiOSParameters = (telmiDevice) => {
    telmiDevice.telmiOS.parameters = JSON.parse(fs.readFileSync(getPathTelmiOsParameters(telmiDevice.drive)).toString('utf8'))
    const pathFlashLogo = getPathTelmiOsFlashLogo(telmiDevice.drive)
    if(fs.existsSync(pathFlashLogo)) {
      telmiDevice.telmiOS.parameters.bootSplashscreen = fs.readFileSync(pathFlashLogo).toString('utf-8')
    } else {
      telmiDevice.telmiOS.parameters.bootSplashscreen = ''
    }
    return telmiDevice
  },

  saveTelmiOSParameters = (telmiDevice) => {
    const parameters = {...telmiDevice.telmiOS.parameters}
    delete parameters.bootSplashscreen
    fs.writeFileSync(getPathTelmiOsParameters(telmiDevice.drive), JSON.stringify(parameters))
    if(telmiDevice.telmiOS.parameters.bootSplashscreen !== '') {
      fs.writeFileSync(getPathTelmiOsFlashLogo(telmiDevice.drive), telmiDevice.telmiOS.parameters.bootSplashscreen)
    }
  }

export {readTelmiOSParameters, saveTelmiOSParameters}
