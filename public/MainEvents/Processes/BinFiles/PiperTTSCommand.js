import {exec} from 'child_process'
import {getBinPath, getExtraResourcesPath} from '../Helpers/AppPaths.js'
import * as path from 'path'
import fs from 'fs'

const
  getTTSExecutable = () => {
    return process.platform === 'win32' ? 'tts.exe' : 'tts'
  },
  getTTSScript = () => {
    return process.platform === 'win32' ? 'tts.bat' : 'tts.sh'
  },
  getPiperTTSFileName = () => {
    return process.platform === 'win32' ? 'piper.exe' : 'piper'
  },

  getPiperTTSCommand = () => {
    return process.platform === 'win32' ? 'type' : 'cat'
  },

  getPiperTTSFilePath = () => {
    const ttsExecutable = getBinPath(getTTSExecutable())
    if(fs.existsSync(ttsExecutable)) {
      return ttsExecutable
    }

    const ttsScript = getBinPath(getTTSScript())
    if(fs.existsSync(ttsScript)) {
      return ttsScript
    }

    return path.join(getExtraResourcesPath(), 'piper', process.platform, getPiperTTSFileName())
  },

  getPiperTTSVoiceNameToPath = (name) => {
    return path.join(getExtraResourcesPath(), 'piper', 'voices', name + '.onnx')
  },

  getPiperTTSVoicePath = (name) => {
    const p = getPiperTTSVoiceNameToPath(name)
    if(fs.existsSync(p)) {
      return p
    }
    return getPiperTTSVoiceNameToPath('fr_FR-beatrice')
  },

  piperTTS = (pathJson, voiceName, voiceSpeaker) => {
    return new Promise((resolve, reject) => {
      exec(
        getPiperTTSCommand() + ' "' + pathJson + '" | "' + getPiperTTSFilePath() + '" --quiet --model "' + getPiperTTSVoicePath(voiceName) + '" --speaker ' + voiceSpeaker + ' --json-input',
        (error, stdout, stderr) => {
          if (error) {
            reject(error.toString())
            return;
          }

          if (stderr) {
            reject(stderr.toString())
            return;
          }

          resolve()
        });
    })
  }

export {piperTTS}
