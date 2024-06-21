import * as fs from 'fs'

const
  saveTelmiSyncParamsContent = (parametersPath, params) => {
    fs.writeFileSync(parametersPath, JSON.stringify(params))
  },
  getTelmiSyncParamsContent = (parametersPath) => {
    if (fs.existsSync(parametersPath)) {
      return JSON.parse(fs.readFileSync(parametersPath))
    }
    return {
      microphone: null,
      piper: {voice: 'fr_FR-upmc', speaker: 0}
    }
  }

export {getTelmiSyncParamsContent, saveTelmiSyncParamsContent}