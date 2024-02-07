import { ipcMain } from 'electron'
import * as fs from 'fs'
import * as path from 'path'
import { getMusicPath } from './Helpers/AppPaths.js'
import { musicObjectToName } from './Helpers/Music.js'
import runProcess from './Processes/RunProcess.js'

function mainEventLocalMusicReader (mainWindow) {
  ipcMain.on(
    'local-musics-get',
    async () => {
      const musicPath = getMusicPath()
      mainWindow.webContents.send(
        'local-musics-data',
        fs.readdirSync(musicPath)
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
      )
    }
  )

  ipcMain.on(
    'local-music-update',
    async (event, music) => {
      if (
        typeof music === 'object' && music !== null &&
        typeof music.id === 'string' && music.id !== '' &&
        typeof music.track === 'number' &&
        typeof music.title === 'string' && music.title !== '' &&
        typeof music.album === 'string' && music.album !== '' &&
        typeof music.artist === 'string' && music.artist !== ''
      ) {
        const
          newFileName = musicObjectToName({
            artist: music.artist,
            album: music.album,
            track: (music.track < 10 ? '0' : '') + music.track,
            title: music.title
          }),
          srcPath = getMusicPath(music.id),
          dstPath = getMusicPath(newFileName),
          srcMusic = srcPath + '.mp3',
          srcImage = srcPath + '.png'

        if (fs.existsSync(srcMusic)) {
          fs.renameSync(srcMusic, dstPath + '.mp3')
        }
        if (fs.existsSync(srcImage)) {
          fs.renameSync(srcImage, dstPath + '.png')
        }
        if (!music.askNewImage) {
          ipcMain.emit('local-musics-get')
        } else {
          runProcess(
            path.join('Music', 'MusicCover.js'),
            [newFileName],
            () => {
              ipcMain.emit('local-musics-get')
            },
            (message, current, total) => {},
            (error) => {
              ipcMain.emit('local-musics-get')
            }
          )
        }
      }
    }
  )

  ipcMain.on(
    'local-musics-delete',
    async (event, id) => {
      if (!Array.isArray(id)) {
        return ipcMain.emit('local-musics-get')
      }

      for (const i of id) {
        if (typeof i !== 'string' || i === '') {
          continue
        }

        const
          musicPath = getMusicPath(i),
          music = musicPath + '.mp3',
          image = musicPath + '.png'

        if (fs.existsSync(music)) {
          fs.rmSync(music)
        }
        if (fs.existsSync(image)) {
          fs.rmSync(image)
        }
      }

      ipcMain.emit('local-musics-get')
    }
  )
}

export default mainEventLocalMusicReader
