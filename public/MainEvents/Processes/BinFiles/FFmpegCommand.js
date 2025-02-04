import {spawn} from 'child_process'
import {getBinPath, getExtraResourcesPath} from '../Helpers/AppPaths.js'
import * as fs from 'fs'
import {rmFile} from '../../Helpers/Files.js'
import path from 'path'

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
          infos = strRes.match(/Stream #[0-9]:[0-9]: Audio: ([A-Za-z0-9._,/ ]+)/i),
          maxVolumeMatch = strRes.match(/ max_volume: -([0-9.]+) dB/i),
          maxVolume = maxVolumeMatch !== null ? parseFloat(maxVolumeMatch[1]) : 0

        if (infos === null || infos.length < 2) {
          resolve([['unknow', 'unknow', 'unknow', 'unknow', '0 kb/s'], maxVolume])
        } else {
          resolve([infos[1].toLowerCase().split(', ').map((v) => v.trim()), maxVolume])
        }
      })
    })
  },
  ffmpegAudioToMp3 = (srcFile, dstMp3, bitrate, maxVolume) => {
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
        '-b:a', bitrate + 'k',
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
  convertAudioToMp3 = (srcFile, dstMp3, forceConverting, forceVolume) => {
    return new Promise((resolve, reject) => {
      getAudioInfos(srcFile)
        .then(([infos, maxVolume]) => {
          const bitrate = infos.length > 4 && infos[4].endsWith('kb/s') ? parseFloat(infos[4].substring(0, infos[4].length - 5)) : 0
          if (
            !forceConverting &&
            infos[0] === 'mp3' &&
            infos[1] === '44100 hz' &&
            (infos[2] === 'mono' || infos[2] === 'stereo') &&
            bitrate >= 64 &&
            bitrate <= 192
          ) {
            try {
              fs.copyFileSync(srcFile, dstMp3)
              resolve()
            } catch (ignored) {
              reject()
            }
          } else {
            ffmpegAudioToMp3(
              srcFile,
              dstMp3,
              bitrate === 0 ? 192 : (bitrate < 64 ? 64 : (bitrate > 192 ? 192 : (Math.ceil(bitrate / 16) * 16))),
              forceVolume ? maxVolume : 0
            )
              .then(() => resolve())
              .catch(() => reject())
          }
        })
        .catch((e) => {
          ffmpegAudioToMp3(srcFile, dstMp3, 192, 0)
            .then(() => resolve())
            .catch(() => reject())
        })
    })
  },
  processStringToFFmpeg = (str) => {
    str = str.replaceAll('\'', '’')
    const aStr = []
    while (str.length > 32) {
      const
        s = str.substring(0, 32),
        i = s.lastIndexOf(' ')
      if (i === -1) {
        const i2 = str.indexOf(' ')
        if (i2 === -1) {
          break
        }
        aStr.push(str.substring(0, i2))
        str = str.substring(i2 + 1)
      } else {
        aStr.push(str.substring(0, i))
        str = str.substring(i + 1)
      }
    }
    aStr.push(str)
    return aStr.map((s) => s.replace(/([^A-Za-z0-9 ]{1})/g, '\\$1')).join('\n')
  },
  convertImageToPng = (srcFile, dstPng, width, height, textToWrite) => {
    return new Promise((resolve, reject) => {
      rmFile(dstPng)
      const
        textCommand = typeof textToWrite === 'string' ?
          ', drawtext=fontfile=\'' + path.join(getExtraResourcesPath(), 'fonts', 'exo2.ttf').replaceAll('\\', '\\\\').replaceAll(':', '\\:') +
          '\':text=\'' + processStringToFFmpeg(textToWrite) + '\':text_align=M+C:fontcolor=black:fontsize=32:' +
          'box=1:boxcolor=white@0.9:boxborderw=10|10:x=(w-text_w)/2:y=h-th-20' : '',

        stream = spawn(getFFmpegFilePath(), ['-i', srcFile, '-vf', 'scale=' + width + 'x' + height + ':flags=bilinear' + textCommand, dstPng])

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
