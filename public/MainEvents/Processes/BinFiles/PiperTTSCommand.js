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

  getPiperTTSBundledPath = () => {
    return path.join(getExtraResourcesPath(), 'piper', process.platform, process.arch, getPiperTTSFileName())
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

    return getPiperTTSBundledPath()
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
      const
        piperPath = getPiperTTSFilePath(),
        isBundledOnMac = process.platform === 'darwin' && piperPath === getPiperTTSBundledPath(),
        // espeak-ng truncates data paths longer than ~160 characters: run the bundled
        // binary from its own directory with a short relative data path.
        espeakOption = isBundledOnMac ? ' --espeak_data espeak-ng-data' : '',
        execOptions = isBundledOnMac ? {cwd: path.dirname(piperPath)} : {}

      exec(
        getPiperTTSCommand() + ' "' + pathJson + '" | "' + piperPath + '" --quiet --model "' + getPiperTTSVoicePath(voiceName) + '" --speaker ' + voiceSpeaker + ' --json-input' + espeakOption,
        execOptions,
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
