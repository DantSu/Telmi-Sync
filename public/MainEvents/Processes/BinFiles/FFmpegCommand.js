import { spawn } from 'child_process'
import { getBinPath } from '../Helpers/AppPaths.js'
import * as fs from 'fs'
import {rmFile} from '../../Helpers/Files.js'

const
  getFFmpegFileName = () => {
    return process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg'
  },
  getFFmpegFilePath = () => {
    return getBinPath(getFFmpegFileName())
  },
  getAudioInfos = (srcFile) => {
    return new Promise((resolve, reject) => {
      const stream = spawn(getFFmpegFilePath(), ['-i', srcFile])
      let data = ''
      stream.stderr.on('data', (d) => {
        data += d.toString()
      })
      stream.on('close', () => {
        const infos = data.toString().match(/Stream #[0-9]:[0-9]: Audio: ([A-Za-z0-9,/ ]+)/i)
        if (infos === null || infos.length < 2) {
          reject('audio-infos-not-found')
        } else {
          resolve(infos[1].toLowerCase().split(', '))
        }
      })
    })
  },
  ffmpegAudioToMp3 = (srcFile, dstMp3) => {
    return new Promise((resolve, reject) => {
      rmFile(dstMp3)
      const stream = spawn(getFFmpegFilePath(), ['-i', srcFile, '-map_metadata', '-1', '-map_chapters', '-1', '-vn', '-ar', '44100', '-ac', '2', '-b:a', '192k', dstMp3])
      stream.on('close', (code) => {
        if (code === 0) {
          resolve()
        } else {
          reject()
        }
      })
    })
  },
  convertAudioToMp3 = (srcFile, dstMp3, forceConverting) => {
    if (!forceConverting) {
      return new Promise((resolve, reject) => {
        getAudioInfos(srcFile)
          .then((infos) => {
            if (infos[0] === 'mp3' && infos[1] === '44100 hz' && (infos[2] === 'stereo' || infos[2] === 'mono')) {
              try {
                fs.copyFileSync(srcFile, dstMp3)
                resolve()
              } catch (ignored) {
                reject()
              }
            } else {
              ffmpegAudioToMp3(srcFile, dstMp3)
                .then(() => resolve())
                .catch(() => reject())
            }
          })
          .catch((e) => {
            ffmpegAudioToMp3(srcFile, dstMp3)
              .then(() => resolve())
              .catch(() => reject())
          })
      })
    }
    return ffmpegAudioToMp3(srcFile, dstMp3)
  },
  convertImageToPng = (srcFile, dstPng, width, height) => {
    return new Promise((resolve, reject) => {
      rmFile(dstPng)
      const stream = spawn(getFFmpegFilePath(), ['-i', srcFile, '-vf', 'scale=' + width + 'x' + height + ':flags=bilinear', dstPng])
      stream.on('close', (code) => {
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
      rmFile(dstTxt)
      const stream = spawn(getFFmpegFilePath(), ['-i', srcFile, '-f', 'ffmetadata', dstTxt])
      stream.on('close', (code) => {
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
      rmFile(dstPng)
      const stream = spawn(getFFmpegFilePath(), ['-i', srcFile, '-filter:v', 'scale=256x256', '-an', dstPng])
      stream.on('close', (code) => {
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
  getAudioInfos,
  convertAudioToMp3,
  convertImageToPng,
  extractMetadataFromMp3,
  extractPngFromMp3
}
