import {getTelmiSyncParamsContent, saveTelmiSyncParamsContent} from './TelmiSyncParamsFiles.js'
import {getParametersPath} from './AppPaths.js'
import * as path from 'path'

const
  getTelmiSyncParamsPath = () => path.join(getParametersPath(), 'parameters.json'),
  saveTelmiSyncParams = (params) => {
    saveTelmiSyncParamsContent(getTelmiSyncParamsPath(), params)
  },
  getTelmiSyncParams = () => {
    return getTelmiSyncParamsContent(getTelmiSyncParamsPath())
  }

export {getTelmiSyncParams, saveTelmiSyncParams}