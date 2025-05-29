import { app } from 'electron'
import homePaths from './HomePaths.js'
import path from 'path'
import {getShortPath} from './Paths.js'

const
  appPathRaw = app.getAppPath(),
  appPath = getShortPath(path.extname(appPathRaw) !== '' ? path.dirname(appPathRaw) : appPathRaw),
  appPaths = homePaths(app.getPath('home')),
  initAppPaths = appPaths.initAppPaths,
  initTmpPath = appPaths.initTmpPath,
  getTmpPath = appPaths.getTmpPath,
  getStoriesPath = appPaths.getStoriesPath,
  getMusicPath = appPaths.getMusicPath,
  getBinPath = appPaths.getBinPath,
  getStoresPath = appPaths.getStoresPath,
  getParametersPath = appPaths.getParametersPath,
  getElectronAppPath = () => appPath,
  getExtraResourcesPath = () => path.join(getElectronAppPath(), 'extraResources')

export { initAppPaths, initTmpPath, getTmpPath, getStoriesPath, getMusicPath, getBinPath, getStoresPath, getParametersPath, getElectronAppPath, getExtraResourcesPath}
