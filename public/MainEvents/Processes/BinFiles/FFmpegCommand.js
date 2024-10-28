import {spawn} from 'child_process'
import {getBinPath} from '../Helpers/AppPaths.js'
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
      const stream = spawn(getFFmpegFilePath(), ['-i', srcFile, '-af', 'volumedetect', '-vn', '-sn', '-dn', '-f', 'null', process.platform === 'win32' ? 'NUL' : '/dev/null'])
      let data = ''
      stream.stderr.on('data', (d) => {
        data += d.toString()
      })
      stream.on('close', () => {
        const
          strRes = data.toString(),
          infos = strRes.match(/Stream #[0-9]:[0-9]: Audio: ([A-Za-z0-9_,/ ]+)/i),
          maxVolumeMatch = strRes.match(/ max_volume: -([0-9.]+) dB/i),
          maxVolume = maxVolumeMatch !== null ? parseFloat(maxVolumeMatch[1]) : 0

        if (infos === null || infos.length < 2) {
          resolve([['unknow', 'unknow', 'unknow', 'unknow'], maxVolume])
        } else {
          resolve([infos[1].toLowerCase().split(', '), maxVolume])
        }
      })
    })
  },
  ffmpegAudioToMp3 = (srcFile, dstMp3, maxVolume) => {
    return new Promise((resolve, reject) => {
      rmFile(dstMp3)
      const stream = spawn(getFFmpegFilePath(), [
        '-i', srcFile,
        '-map_metadata', '-1',
        '-map_chapters', '-1',
        '-vn',
        ...(maxVolume > 0 ? ['-af', 'volume=' + maxVolume + 'dB'] : []),
        '-ar', '44100',
        '-ac', '2',
        '-b:a', '192k',
        dstMp3])
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
      return new Promise((resolve, reject) => {
        getAudioInfos(srcFile)
          .then(([infos, maxVolume]) => {
            if (!forceConverting && infos[0] === 'mp3' && infos[1] === '44100 hz' && (infos[2] === 'stereo' || infos[2] === 'mono')) {
              try {
                fs.copyFileSync(srcFile, dstMp3)
                resolve()
              } catch (ignored) {
                reject()
              }
            } else {
              ffmpegAudioToMp3(srcFile, dstMp3, maxVolume)
                .then(() => resolve())
                .catch(() => reject())
            }
          })
          .catch((e) => {
            ffmpegAudioToMp3(srcFile, dstMp3, 0)
              .then(() => resolve())
              .catch(() => reject())
          })
      })
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
      const stream = spawn(getFFmpegFilePath(), ['-i', srcFile, '-filter:v', 'scale=256x256', '-an', '-update', 'true', dstPng])
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
