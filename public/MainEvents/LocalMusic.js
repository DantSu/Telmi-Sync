import { ipcMain } from 'electron'
import * as fs from 'fs'
import * as path from 'path'
import { getMusicPath } from './Helpers/AppPaths.js'
import { deleteMusic, musicObjectToName, readMusic } from './Helpers/Music.js'
import runProcess from './Processes/RunProcess.js'

function mainEventLocalMusicReader (mainWindow) {
  ipcMain.on(
    'local-musics-get',
    async () => {
      mainWindow.webContents.send('local-musics-data', readMusic(getMusicPath()))
    }
  )

  const localMusicUpdate = (musics, images = {}) => {
    if (!musics.length) {
      ipcMain.emit('local-musics-get')
      return
    }

    const music = musics.shift()

    if (
      typeof music !== 'object' || music === null ||
      typeof music.id !== 'string' || music.id === '' ||
      typeof music.track !== 'number' ||
      typeof music.title !== 'string' || music.title === '' ||
      typeof music.album !== 'string' || music.album === '' ||
      typeof music.artist !== 'string' || music.artist === ''
    ) {
      return localMusicUpdate(musics, images)
    }

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
      srcImage = srcPath + '.png',
      dstMusic = dstPath + '.mp3',
      dstImage = dstPath + '.png'

    if (fs.existsSync(srcMusic)) {
      fs.renameSync(srcMusic, dstMusic)
    }

    if (!music.askNewImage) {

      if (fs.existsSync(srcImage)) {
        fs.renameSync(srcImage, dstImage)
      }

      ipcMain.emit('local-musics-get')

    } else {

      if (fs.existsSync(srcImage)) {
        fs.rmSync(srcImage)
      }

      const
        pathCoverKey = music.artist + '_' + music.album,
        pathCover = images[pathCoverKey]

      if (pathCover !== undefined && fs.existsSync(pathCover)) {

        fs.copyFileSync(pathCover, dstImage)
        localMusicUpdate(musics, images)

      } else {

        runProcess(
          path.join('Music', 'MusicCover.js'),
          [newFileName],
          () => {
            localMusicUpdate(musics, {...images, [pathCoverKey]: dstImage})
          },
          (message, current, total) => {},
          (error) => {
            localMusicUpdate(musics, images)
          }
        )

      }
    }
  }

  ipcMain.on(
    'local-musics-update',
    async (event, musics) => {
      if (!Array.isArray(musics) && !musics.length) {
        return
      }
      localMusicUpdate(musics)
    }
  )

  ipcMain.on(
    'local-musics-delete',
    async (event, ids) => {
      if (deleteMusic(getMusicPath(), ids)) {
        ipcMain.emit('local-musics-get')
      }
    }
  )
}

export default mainEventLocalMusicReader
