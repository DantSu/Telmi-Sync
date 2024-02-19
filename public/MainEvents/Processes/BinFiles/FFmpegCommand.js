import { spawn } from 'child_process'
import { getBinPath } from '../Helpers/AppPaths.js'

const
  getFFmpegFileName = () => {
    return process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg'
  },
  getFFmpegFilePath = () => {
    return getBinPath(getFFmpegFileName())
  },
  convertAudioToMp3 = (srcFile, dstMp3) => {
    return new Promise((resolve, reject) => {
      const stream = spawn(getFFmpegFilePath(), ['-i', srcFile, '-map_metadata', '-1', '-map_chapters', '-1', '-vn', '-ar', '44100', '-ac', '2', '-b:a', '192k', dstMp3])
      stream.on('close', code => {
        if (code === 0) {
          resolve()
        } else {
          reject()
        }
      })
    })
  },
  convertImageToPng = (srcFile, dstPng, width, height) => {
    return new Promise((resolve, reject) => {
      const stream = spawn(getFFmpegFilePath(), ['-i', srcFile, '-vf', 'scale=' + width + 'x' + height + ':flags=bilinear', dstPng])
      stream.on('close', code => {
        if (code === 0) {
          resolve()
        } else {
          reject()
        }
      })
    })
  },
  extractMetadataFromMp3 = (srcFile, dstTxt) => {
    return new Promise((resolve, reject) => {
      const stream = spawn(getFFmpegFilePath(), ['-i', srcFile, '-f', 'ffmetadata', dstTxt])
      stream.on('close', code => {
        if (code === 0) {
          resolve()
        } else {
          reject()
        }
      })
    })
  },
  extractPngFromMp3 = (srcFile, dstPng) => {
    return new Promise((resolve, reject) => {
      const stream = spawn(getFFmpegFilePath(), ['-i', srcFile, '-filter:v', 'scale=256x256', '-an', dstPng])
      stream.on('close', code => {
        if (code === 0) {
          resolve()
        } else {
          reject()
        }
      })
    })
  }

export {
  getFFmpegFileName,
  getFFmpegFilePath,
  convertAudioToMp3,
  convertImageToPng,
  extractMetadataFromMp3,
  extractPngFromMp3
}
