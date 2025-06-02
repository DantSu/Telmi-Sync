import {ipcMain} from 'electron'
import * as fs from 'fs'
import * as path from 'path'
import {getMusicPath, initTmpPath} from './Helpers/AppPaths.js'
import {musicObjectToName} from './Helpers/Music.js'
import {deleteMusic, readMusic} from './Helpers/MusicFiles.js'
import runProcess from './Processes/RunProcess.js'

function mainEventLocalMusicReader(mainWindow) {
  ipcMain.on(
    'local-musics-get',
    async () => {
      mainWindow.webContents.send('local-musics-data', readMusic(getMusicPath()))
    }
  )

  const localMusicUpdate = (musics, albumImage) => {
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
      return localMusicUpdate(musics, albumImage)
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

    if (srcMusic !== dstMusic && fs.existsSync(srcMusic)) {
      fs.renameSync(srcMusic, dstMusic)
    }

    if (typeof music.newImage === 'string' && music.newImage !== '' && fs.existsSync(music.newImage)) {
      if (fs.existsSync(srcImage)) {
        fs.rmSync(srcImage)
      }
      runProcess(
        path.join('Music', 'MusicConvertCover.js'),
        [music.newImage, dstImage],
        () => {},
        (message, current, total) => {},
        (error) => {},
        () => localMusicUpdate(musics, albumImage)
      )
    } else if (albumImage !== undefined) {
      if (fs.existsSync(srcImage)) {
        fs.rmSync(srcImage)
      }
      if (fs.existsSync(albumImage)) {
        fs.copyFileSync(albumImage, dstImage)
      }
      localMusicUpdate(musics, albumImage)
    } else {
      if (srcImage !== dstImage && fs.existsSync(srcImage)) {
        fs.renameSync(srcImage, dstImage)
      }
      localMusicUpdate(musics, dstImage)
    }
  }

  ipcMain.on(
    'local-musics-cover',
    async (event, music) => {
      const
        dstPath = path.join(initTmpPath('music'), Date.now().toString(36)),
        titleTask = music.artist + ' - ' + music.album

      runProcess(
        path.join('Music', 'MusicBrainzCover.js'),
        [dstPath, music.artist, music.album],
        () => {
          mainWindow.webContents.send('local-musics-cover-path', dstPath)
        },
        (message, current, total) => {
          mainWindow.webContents.send('local-musics-cover-task', titleTask, message, current, total)
        },
        (error) => {
          mainWindow.webContents.send('local-musics-cover-error', titleTask, error)
        },
        () => {
          mainWindow.webContents.send('local-musics-cover-task', '', '', 0, 0)
        }
      )
    }
  )

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
      deleteMusic(
        getMusicPath(),
        ids,
        () => ipcMain.emit('local-musics-get')
      )
    }
  )
}

export default mainEventLocalMusicReader
