import { stringNormalizeFileName } from './Strings.js'
import * as fs from 'fs'
import * as path from 'path'
import runProcess from '../Processes/RunProcess.js'

const
  musicObjectToName = (data) => {
    return Object.values(data).map((v) => stringNormalizeFileName(v)).join('_')
  },
  musicNameToObject = (name) => {
    const data = name.split('_')
    return {
      artist: data[0],
      album: data[1],
      track: data[2],
      title: data[3],
    }
  },
  readMusic = (musicPath) => {
    if(!fs.existsSync(musicPath)) {
      return []
    }
    return fs.readdirSync(musicPath)
      .filter((f) => path.extname(f) === '.mp3')
      .sort()
      .map((f) => {
        const
          name = path.parse(f).name,
          [artist, album, track, title] = name.split('_')
        return {
          id: name,
          music: path.join(musicPath, f),
          image: path.join(musicPath, name + '.png') + '?t=' + Math.trunc(Date.now() / 10000),
          track: parseInt(track, 10),
          title,
          album,
          artist
        }
      })
  },
  deleteMusic = (musicPath, ids, onEnd) => {
    if (!Array.isArray(ids)) {
      return false
    }

    runProcess(
      path.join('Music', 'MusicDelete.js'),
      [musicPath, ...ids],
      onEnd,
      (message, current, total) => {},
      onEnd
    )
    return true
  }

export { musicObjectToName, musicNameToObject, readMusic, deleteMusic }
