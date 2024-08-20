import {ipcMain} from 'electron'
import * as fs from 'fs'
import {getStoresPath} from './Helpers/AppPaths.js'
import {requestJson} from './Helpers/Request.js'
import runProcess from './Processes/RunProcess.js'
import * as path from 'path'

const checkStore = (store) => {
  return typeof store === 'object' && store !== null &&
    typeof store.name === 'string' && store.name !== '' &&
    typeof store.url === 'string' && store.url !== ''
}

function mainEventStores(mainWindow) {
  ipcMain.on(
    'stores-get',
    async () => {
      const storesPath = getStoresPath('stores.json')
      const defaultStores = [{
        name: 'Telmi Interactive',
        url: 'https://gist.githubusercontent.com/DantSu/49ed776755f3a01c995e78e3fd1cb79f/raw/telmi-interactive.json',
        deletable: false
      }]

      if (!fs.existsSync(storesPath)) {
        fs.writeFileSync(storesPath, JSON.stringify({stores: defaultStores}))
      }

      const jsonStores = JSON.parse(fs.readFileSync(storesPath).toString('utf8'))

      if (!defaultStores.filter((store) => jsonStores.stores.find((s) => store.url === s.url) === undefined).length) {
        return mainWindow.webContents.send('stores-data', jsonStores.stores)
      }

      const newStores = [
        ...defaultStores,
        ...jsonStores.stores.filter((store) => defaultStores.find((s) => store.url === s.url) === undefined).map((store) => ({...store, deletable:true}))
      ]
      fs.writeFileSync(storesPath, JSON.stringify({stores: newStores}))
      mainWindow.webContents.send('stores-data', newStores)
    }
  )

  ipcMain.on(
    'store-add',
    async (event, store) => {
      if (checkStore(store)) {
        const
          storesPath = getStoresPath('stores.json'),
          storesContent = fs.existsSync(storesPath) ? JSON.parse(fs.readFileSync(storesPath).toString('utf8')) : {}

        fs.writeFileSync(
          storesPath,
          JSON.stringify({
            stores: [
              ...storesContent.stores,
              store
            ]
          })
        )
        ipcMain.emit('stores-get')
      }
    }
  )

  ipcMain.on(
    'store-delete',
    async (event, store) => {
      if (checkStore(store)) {
        const storesPath = getStoresPath('stores.json')

        if (fs.existsSync(storesPath)) {
          fs.writeFileSync(
            storesPath,
            JSON.stringify({
              stores: JSON
                .parse(fs.readFileSync(storesPath).toString('utf8'))
                .stores
                .filter((s) => s.url !== store.url || s.name !== store.name)
            })
          )
        }

        ipcMain.emit('stores-get')
      }
    }
  )

  const
    findThumb = (v) => {
      if (typeof v.thumbs === 'object' && v.thumbs !== null) {
        return v.thumbs.medium
      }
      if (typeof v.smallThumbUrl === 'string') {
        return v.smallThumbUrl
      }
      return null
    }

  ipcMain.on(
    'store-remote-get',
    async (event, store) => {
      if (checkStore(store)) {
        requestJson(store.url, {})
          .then((response) => {
            mainWindow.webContents.send(
              'store-remote-data',
              {
                ...response,
                data: response.data.map((v) => ({
                  title: v.title,
                  age: v.age,
                  category: v.category,
                  description: v.description,
                  image: findThumb(v),
                  download: v.download || v.downloadUrl,
                  download_count: v.download_count || 0,
                  author: v.author || '',
                  voice: v.voice || '',
                  designer: v.designer || '',
                  publisher: v.publisher || '',
                  awards: v.awards || [],
                  created_at: v.created_at || '1970-01-01T00:00:00.000Z',
                  updated_at: v.updated_at || '1970-01-01T00:00:00.000Z',
                  uuid: v.uuid || ''
                }))
              }
            )
          })
          .catch((e) => {
            console.log(e.toString())
          })
      }
    }
  )

  let taskRunning = null
  const runDownload = (stories) => {
    if (!stories.length) {
      taskRunning = null
      mainWindow.webContents.send('store-download-task', '', '', 0, 0)
      return ipcMain.emit('local-stories-get')
    }

    const story = stories.shift()
    mainWindow.webContents.send('store-download-task', story.title, 'initialize', 0, 1)
    mainWindow.webContents.send('store-download-waiting', stories)

    taskRunning = runProcess(
      path.join('Store', 'StoreDownload.js'),
      [story.download],
      () => {
      },
      (message, current, total) => {
        mainWindow.webContents.send('store-download-task', story.title, message, current, total)
      },
      (error) => {
        mainWindow.webContents.send('store-download-error', story.title, error)
      },
      () => runDownload(stories)
    )
  }
  ipcMain.on('store-download', async (event, stories) => runDownload(stories))
  ipcMain.on(
    'store-download-cancel',
    async () => {
      if (taskRunning !== null) {
        taskRunning.process.kill()
      }
    }
  )

}

export default mainEventStores
