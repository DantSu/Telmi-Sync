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
              url: 'https://gist.githubusercontent.com/UnofficialStories/32702fb104aebfe650d4ef8d440092c1/raw/luniicreations.json'
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

  ipcMain.on(
    'store-remote-get',
    async (event, store) => {
      if (checkStore(store)) {
        requestJson(store.url, {})
          .then((data) => {
            mainWindow.webContents.send(
              'store-remote-data',
              data
                .sort((a, b) => {
                  if ((a.age - b.age) === 0) {
                    return a.title.localeCompare(b.title)
                  } else {
                    return a.age - b.age
                  }
                })
                .map((v) => ({
                  title: '[' + v.age + '+] ' + v.title,
                  image: v.smallThumbUrl,
                  downloadUrl: v.downloadUrl
                })))
          })
          .catch((e) => {console.log(e.toString())})
      }
    }
  )


  let taskRunning = null
  const runDownload = (stories) => {
    if(!stories.length) {
      taskRunning = null
      mainWindow.webContents.send('store-download-task', '', '', 0, 0)
      return ipcMain.emit('local-stories-get')
    }

    const story = stories.shift()
    mainWindow.webContents.send('store-download-task', story.title, 'initialize', 0, 1)
    mainWindow.webContents.send('store-download-waiting', stories)

    taskRunning = runProcess(
      path.join('Store', 'StoreDownload.js'),
      [story.downloadUrl],
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
