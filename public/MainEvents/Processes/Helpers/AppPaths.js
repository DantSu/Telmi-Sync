import * as os from 'os'
import * as path from 'path'
import homePaths from '../../Helpers/HomePaths.js'

const
  appPaths = homePaths(os.homedir()),
  initAppPaths = appPaths.initAppPaths,
  initTmpPath = appPaths.initTmpPath,
  getTmpPath = appPaths.getTmpPath,
  getStoriesPath = appPaths.getStoriesPath,
  getMusicPath = appPaths.getMusicPath,
  getBinPath = appPaths.getBinPath,
  getStoresPath = appPaths.getStoresPath,
  getParametersPath = appPaths.getParametersPath,
  getElectronAppPath = () => {
    const tag = '[electron-apppath]'
    return process.argv.find((v) => v.substring(0, tag.length) === tag).substring(tag.length)
  },
  getExtraResourcesPath = () => path.join(getElectronAppPath(), 'extraResources')

export { initAppPaths, initTmpPath, getTmpPath, getStoriesPath, getMusicPath, getBinPath, getStoresPath, getElectronAppPath, getParametersPath, getExtraResourcesPath }
