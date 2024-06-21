import { app } from 'electron'
import homePaths from './HomePaths.js'

const
  appPaths = homePaths(app.getPath('home')),
  initAppPaths = appPaths.initAppPaths,
  initTmpPath = appPaths.initTmpPath,
  getStoriesPath = appPaths.getStoriesPath,
  getMusicPath = appPaths.getMusicPath,
  getBinPath = appPaths.getBinPath,
  getStoresPath = appPaths.getStoresPath,
  getParametersPath = appPaths.getParametersPath

export { initAppPaths, initTmpPath, getStoriesPath, getMusicPath, getBinPath, getStoresPath, getParametersPath }
