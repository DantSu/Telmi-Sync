import * as fs from 'fs'
import * as path from 'path'
import runProcess from '../Processes/RunProcess.js'
import {rmFile} from './Files.js'

const
  readMusic = (musicsPath) => {
    if (!fs.existsSync(musicsPath)) {
      return []
    }
    return fs.readdirSync(musicsPath)
      .filter((f) => path.extname(f) === '.mp3')
      .sort()
      .reduce(
        (acc, f) => {
          const
            name = path.parse(f).name,
            [artist, album, track, title] = name.split('_'),
            musicPath = path.join(musicsPath, f),
            imagePath = path.join(musicsPath, name + '.png')

          if (!fs.existsSync(imagePath)) {
            rmFile(musicPath)
            return acc
          }

          return [
            ...acc,
            {
              id: name,
              music: musicPath,
              image: imagePath + '?t=' + Math.trunc(Date.now() / 10000),
              track: parseInt(track, 10),
              title,
              album,
              artist
            }
          ]
        },
        []
      )
  },
  deleteMusic = (mainWindow, musicPath, ids, onFinished) => {
    if (!Array.isArray(ids)) {
      return false
    }

    runProcess(
      mainWindow,
      path.join('Music', 'MusicDelete.js'),
      [musicPath, ...ids],
      () => {},
      () => {},
      () => {},
      onFinished
    )
    return true
  }

export {readMusic, deleteMusic}
