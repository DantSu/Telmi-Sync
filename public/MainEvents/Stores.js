import {ipcMain} from 'electron'
import * as fs from 'fs'
import {getStoresPath, initTmpPath} from './Helpers/AppPaths.js'
import {requestJson, requestJsonOrXml} from './Helpers/Request.js'
import runProcess from './Processes/RunProcess.js'
import * as path from 'path'
import {rmFile} from './Helpers/Files.js'
import {stripHtmlTags} from './Helpers/Strings.js'

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
      const defaultStores = [
        {
          name: 'Telmi Interactive',
          url: 'https://gist.githubusercontent.com/DantSu/49ed776755f3a01c995e78e3fd1cb79f/raw/telmi-interactive.json',
          deletable: false
        },
        {
          name: 'Litteratureaudio.com',
          url: 'https://gist.githubusercontent.com/DantSu/c6a58c2d0f3b4dc01ed6cdeed6b93ebb/raw/litteratureaudio.json',
          deletable: false
        }
      ]

      if (!fs.existsSync(storesPath)) {
        fs.writeFileSync(storesPath, JSON.stringify({stores: defaultStores}))
      }

      const jsonStores = JSON.parse(fs.readFileSync(storesPath).toString('utf8'))

      if (!defaultStores.filter((store) => jsonStores.stores.find((s) => store.url === s.url) === undefined).length) {
        return mainWindow.webContents.send('stores-data', jsonStores.stores)
      }

      const newStores = [
        ...defaultStores,
        ...jsonStores.stores.filter((store) => defaultStores.find((s) => store.url === s.url) === undefined).map((store) => ({
          ...store,
          deletable: true
        }))
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

        if (storesContent.stores.find((s) => s.url === store.url) === undefined) {
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
    }
  )
  ipcMain.on(
    'store-update',
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
                .map((s) => s.url !== store.url ? s : store)
            })
          )
        }
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
                .filter((s) => s.url !== store.url)
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
    },
    getFirstArrayElement = (arr) => Array.isArray(arr) && arr.length > 0 ? arr[0] : undefined,
    getItuneImageHref = (arr) => {
      if (!Array.isArray(arr)) {
        return null
      }
      return (arr.find((img) => img.$ !== undefined && img.$.href !== undefined) || {'$': {}}).$.href || null
    }

  ipcMain.on(
    'store-remote-get',
    async (event, store) => {
      if (checkStore(store)) {
        requestJsonOrXml(store.url, {})
          .then((response) => {
            if (response.rss !== undefined) {
              const
                channel = getFirstArrayElement(response.rss.channel)

              if (channel === undefined || channel.item === undefined || channel.item.length === 0) {
                return mainWindow.webContents.send('store-remote-data', [])
              }

              const
                copyright = getFirstArrayElement(channel.copyright) || '',
                imageUrl = getFirstArrayElement((getFirstArrayElement(channel.image) || {}).url) || getItuneImageHref(channel['itunes:image']) || getItuneImageHref(channel.item[0]['itunes:image'])

              if (imageUrl === undefined) {
                return mainWindow.webContents.send('store-remote-data', [])
              }

              mainWindow.webContents.send(
                'store-remote-data',
                {
                  audioList: true,
                  store: {
                    title: getFirstArrayElement(channel.title) || 'Unknow title',
                    copyright: copyright,
                    description: stripHtmlTags(getFirstArrayElement(channel.description)) || '',
                    cover: imageUrl
                  },
                  banner: {
                    image: imageUrl,
                    background: '#2e144b',
                    link: getFirstArrayElement(channel.link)
                  },
                  data: channel.item.reduce(
                    (acc, v) => {
                      const episodeType = getFirstArrayElement(v['itunes:episodeType'])

                      if (episodeType === 'trailer' || v.enclosure === undefined) {
                        return acc
                      }

                      const downloadUrl = v.enclosure.find((encl) => encl.$.type.startsWith('audio/'))

                      if (downloadUrl === undefined) {
                        return acc
                      }

                      return [
                        ...acc,
                        {
                          title: getFirstArrayElement(v.title) || '',
                          age: 0,
                          category: getFirstArrayElement(v.category) || '',
                          description: getFirstArrayElement(v.description) || '',
                          image: getItuneImageHref(v['itunes:image']) || imageUrl,
                          download: downloadUrl.$.url,
                          download_count: 0,
                          author: getFirstArrayElement(v['itunes:author']) || getFirstArrayElement(v.author) || copyright,
                          voice: copyright,
                          designer: copyright,
                          publisher: copyright,
                          license: copyright,
                          awards: [],
                          created_at: getFirstArrayElement(v.pubDate) || '1970-01-01T00:00:00.000Z',
                          updated_at: getFirstArrayElement(v.pubDate) || '1970-01-01T00:00:00.000Z',
                          uuid: '',
                          version: 0
                        }]
                    },
                    []
                  )
                }
              )
            } else {
              mainWindow.webContents.send(
                'store-remote-data',
                {
                  ...response,
                  audioList: false,
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
                    license: v.license || '',
                    awards: v.awards || [],
                    created_at: v.created_at || '1970-01-01T00:00:00.000Z',
                    updated_at: v.updated_at || '1970-01-01T00:00:00.000Z',
                    uuid: v.uuid || '',
                    version: v.version || 0
                  }))
                }
              )
            }
          })
          .catch((e) => {
            console.log(e.toString())
          })
      }
    }
  )

  let downloadTaskRunning = null
  const runDownload = (stories) => {
    if (!stories.length) {
      downloadTaskRunning = null
      mainWindow.webContents.send('store-download-task', '', '', 0, 0)
      return ipcMain.emit('local-stories-get')
    }

    const story = stories.shift()
    mainWindow.webContents.send('store-download-task', story.title, 'initialize', 0, 1)
    mainWindow.webContents.send('store-download-waiting', stories)

    downloadTaskRunning = runProcess(
      mainWindow,
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
      if (downloadTaskRunning !== null) {
        downloadTaskRunning.process.kill()
      }
    }
  )


  let buildTaskRunning = null
  ipcMain.on('store-build', async (event, audioList) => {
    mainWindow.webContents.send('store-build-task', audioList.title, 'initialize', 0, 1)
    mainWindow.webContents.send('store-build-waiting', [])

    const pathJson = path.join(initTmpPath('store'), 'store-builder.json')

    rmFile(pathJson)
    fs.writeFileSync(pathJson, JSON.stringify(audioList))

    buildTaskRunning = runProcess(
      mainWindow,
      path.join('Store', 'StoreBuild.js'),
      [pathJson],
      () => {
      },
      (message, current, total) => {
        mainWindow.webContents.send('store-build-task', audioList.title, message, current, total)
      },
      (error) => {
        mainWindow.webContents.send('store-build-error', audioList.title, error)
      },
      () => {
        buildTaskRunning = null
        mainWindow.webContents.send('store-build-task', '', '', 0, 0)
        ipcMain.emit('local-stories-get')
      }
    )
  })

  ipcMain.on(
    'store-build-cancel',
    async () => {
      if (buildTaskRunning !== null) {
        buildTaskRunning.process.kill()
      }
    }
  )

  ipcMain.on(
    'store-rssfeed-get',
    async () => {
      requestJson('https://gist.githubusercontent.com/DantSu/75dfd354b587e7e353302834967e48bc/raw/rss-feed.json', {})
        .then((res) => {
          mainWindow.webContents.send('store-rssfeed-data', res)
        })
    }
  )
}

export default mainEventStores
