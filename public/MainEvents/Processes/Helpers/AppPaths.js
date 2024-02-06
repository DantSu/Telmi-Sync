import * as os from 'os'
import homePaths from '../../Helpers/HomePaths.js'

const
  appPaths = homePaths(os.homedir()),
  initAppPaths = appPaths.initAppPaths,
  initTmpPath = appPaths.initTmpPath,
  getStoriesPath = appPaths.getStoriesPath,
  getMusicPath = appPaths.getMusicPath,
  getBinPath = appPaths.getBinPath,
  getStoresPath = appPaths.getStoresPath,
  getElectronAppPath = () => {
    const tag = '[electron-apppath]'
    return process.argv.find((v) => v.substring(0, tag.length) === tag).substring(tag.length)
  }

export { initAppPaths, initTmpPath, getStoriesPath, getMusicPath, getBinPath, getStoresPath, getElectronAppPath }
