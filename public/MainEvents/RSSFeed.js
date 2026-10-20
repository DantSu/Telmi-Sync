import {ipcMain} from 'electron'
import {requestJson} from './Helpers/Request.js'

const rssFeedDetailsUrlPrefix = 'https://raw.githubusercontent.com/DantSu/telmi-rss-feed-podcasts/'

function mainEventRSSFeed(mainWindow) {
  ipcMain.on(
    'store-rssfeed-get',
    async () => {
      requestJson('https://gist.githubusercontent.com/DantSu/75dfd354b587e7e353302834967e48bc/raw/rss-feed.json', {})
        .then((res) => {
          mainWindow.webContents.send('store-rssfeed-data', res)
        })
    }
  )

  ipcMain.on(
    'store-rssfeed-details-get',
    async (event, dataUrl) => {
      if (typeof dataUrl !== 'string' || dataUrl === '' || !dataUrl.startsWith(rssFeedDetailsUrlPrefix)) {
        return
      }

      requestJson(dataUrl, {})
        .then((res) => {
          mainWindow.webContents.send('store-rssfeed-details-data', {dataUrl, ...res})
        })
        .catch(() => {
          mainWindow.webContents.send('store-rssfeed-details-error', dataUrl)
        })
    }
  )
}

export default mainEventRSSFeed
