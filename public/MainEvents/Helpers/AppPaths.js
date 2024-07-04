import { app } from 'electron'
import homePaths from './HomePaths.js'
import path from 'path'

const
  appPath = app.getAppPath(),
  appPaths = homePaths(app.getPath('home')),
  initAppPaths = appPaths.initAppPaths,
  initTmpPath = appPaths.initTmpPath,
  getStoriesPath = appPaths.getStoriesPath,
  getMusicPath = appPaths.getMusicPath,
  getBinPath = appPaths.getBinPath,
  getStoresPath = appPaths.getStoresPath,
  getParametersPath = appPaths.getParametersPath,
  getElectronAppPath = () => path.extname(appPath) !== '' ? path.dirname(appPath) : appPath,
  getExtraResourcesPath = () => path.join(getElectronAppPath(), 'extraResources')

export { initAppPaths, initTmpPath, getStoriesPath, getMusicPath, getBinPath, getStoresPath, getParametersPath, getElectronAppPath, getExtraResourcesPath}
