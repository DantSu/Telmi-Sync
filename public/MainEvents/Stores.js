import { ipcMain } from 'electron'
import * as fs from 'fs'
import { getStoresPath } from './Helpers/AppPaths.js'
import { requestJson } from './Helpers/Request.js'
import runProcess from './Processes/RunProcess.js'
import * as path from 'path'

const checkStore = (store) => {
  return typeof store === 'object' && store !== null &&
    typeof store.name === 'string' && store.name !== '' &&
    typeof store.url === 'string' && store.url !== ''
}

function mainEventStores (mainWindow) {
  ipcMain.on(
    'stores-get',
    async () => {
      const storesPath = getStoresPath('stores.json')

      if (!fs.existsSync(storesPath)) {
        fs.writeFileSync(
          storesPath,
          JSON.stringify({
            stores: [{
              name: 'Raconte-moi une histoire',
              url: 'https://gist.githubusercontent.com/DantSu/3aea4c1fe15070bcf394a40b89aec33e/raw/stories.json'
            }]
          })
        )
      }

      mainWindow.webContents.send(
        'stores-data',
        JSON.parse(fs.readFileSync(storesPath).toString('utf8')).stores
      )
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
          .then((data) => {
            mainWindow.webContents.send(
              'store-remote-data',
              data.map((v) => ({
                title: v.title,
                age: v.age,
                description: v.description,
                image: findThumb(v),
                download: v.download || v.downloadUrl,
                awards: v.awards || [],
                created_at: v.created_at || '1970-01-01T00:00:00.000Z',
                updated_at: v.updated_at || '1970-01-01T00:00:00.000Z',
                uuid: v.uuid || ''
              }))
            )
          })
          .catch((e) => {console.log(e.toString())})
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
      () => {},
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
