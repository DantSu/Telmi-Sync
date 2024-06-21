import {exec} from 'child_process'
import {getElectronAppPath} from '../Helpers/AppPaths.js'
import * as path from 'path'

const
  getPiperTTSFileName = () => {
    return process.platform === 'win32' ? 'piper.exe' : 'piper'
  },

  getPiperTTSCommand = () => {
    return process.platform === 'win32' ? 'type' : 'cat'
  },

  getPiperTTSFilePath = () => {
    return path.join(getElectronAppPath(), 'extraResources', 'piper', process.platform, getPiperTTSFileName())
  },

  getPiperTTSVoicePath = (name) => {
    return path.join(getElectronAppPath(), 'extraResources', 'piper', 'voices', name + '.onnx')
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
