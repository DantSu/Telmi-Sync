import {app, BrowserWindow, Menu} from 'electron'
import isDev from 'electron-is-dev'
import mainEventWindow from './MainEvents/Window.js'
import mainEventImport from './MainEvents/Import.js'
import mainEventDownloadFFmpeg from './MainEvents/DownloadFFmpeg.js'
import mainEventLocalStoriesReader from './MainEvents/LocalStories.js'
import mainEventLocalMusicReader from './MainEvents/LocalMusic.js'
import mainEventStores from './MainEvents/Stores.js'
import mainEventTelmiOS from './MainEvents/TelmiOS.js'
import mainEventTelmiOSStoriesReader from './MainEvents/TelmiOSStories.js'
import mainEventTelmiOSMusicReader from './MainEvents/TelmiOSMusic.js'
import mainEventUpdate from './MainEvents/Update.js'
import mainEventLink from './MainEvents/Link.js'
import mainEventStudio from './MainEvents/Studio.js'
import mainEventTelmiSyncParams from './MainEvents/TelmiSyncParams.js'
import mainEventPiperTTS from './MainEvents/PiperTTS.js'
import mainEventAudioRecord from './MainEvents/AudioRecord.js'
import mainEventFileManager from './MainEvents/FilesManager.js'
import mainEventTableState from './MainEvents/TableState.js'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    },
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile('build/index.html')
  }
  Menu.setApplicationMenu(null)

  mainEventWindow(mainWindow)
  mainEventLink(mainWindow)
  mainEventFileManager(mainWindow)
  mainEventImport(mainWindow)
  mainEventDownloadFFmpeg(mainWindow)
  mainEventLocalStoriesReader(mainWindow)
  mainEventLocalMusicReader(mainWindow)
  mainEventStores(mainWindow)
  mainEventTelmiOS(mainWindow)
  mainEventTelmiOSStoriesReader(mainWindow)
  mainEventTelmiOSMusicReader(mainWindow)
  mainEventUpdate(mainWindow)
  mainEventStudio(mainWindow)
  mainEventTelmiSyncParams(mainWindow)
  mainEventPiperTTS(mainWindow)
  mainEventAudioRecord(mainWindow)
  mainEventTableState(mainWindow)

  return mainWindow
}

function initApp() {
  const gotTheLock = app.requestSingleInstanceLock()

  if (!gotTheLock) {
    app.quit()
    return
  }

  let mainWindow = null

  const setWindow = () => {
    if (!(mainWindow instanceof BrowserWindow)) {
      mainWindow = createWindow()
    }
  }

  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore()
      }
      mainWindow.focus()
    }
  })
  app.on('ready', setWindow)
  app.on('window-all-closed', () => app.quit())
  app.on('activate', () => BrowserWindow.getAllWindows().length === 0 && setWindow())
}

initApp()
