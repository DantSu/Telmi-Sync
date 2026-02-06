import * as http from 'http'
import * as path from 'path'
import * as fs from 'fs'
import * as os from 'os'
import {readStories} from '../../Helpers/Stories.js'
import {getStoriesPath, initTmpPath} from '../Helpers/AppPaths.js'
import {pack} from '../BinFiles/7zipCommands.js'

const PORT = 7311

const
  getLocalIP = () => {
    const
      ints = os.networkInterfaces(),
      addresses192 = [],
      addresses172 = [],
      addresses10 = []

    for (const intName in ints) {
      const int = ints[intName]
      for (const intInfo of int) {
        if (!intInfo.internal && intInfo.family === 'IPv4') {
          const [a, b, c] = intInfo.address.split('.', 3)
          switch (a) {
            case '192':
              if (b === '168') {
                addresses192.push(intInfo.address)
              }
              break
            case '172':
              const bi = parseInt(b, 10)
              if (bi > 15 && bi < 32) {
                addresses172.push(intInfo.address)
              }
              break
            case '10':
              addresses10.push(intInfo.address)
              break
          }
        }
      }
    }
    return [...addresses192, ...addresses172, ...addresses10]
  },
  resError404 = (res) => {
    res.writeHead(404, {'Content-Type': 'application/json'})
    res.end(JSON.stringify({error: 'Not found'}))
  },
  resError500 = (res, error) => {
    res.writeHead(500, {'Content-Type': 'application/json'})
    res.end(JSON.stringify({error: error.message || 'Internal server error'}))
  }

function main() {
  process.stdout.write('*server-launching***')

  const
    storiesPath = getStoriesPath(),
    list = readStories(storiesPath).stories.map((story) => ({
      title: story.title,
      age: story.age,
      category: story.category || '',
      description: story.description || '',
      thumbs: {
        small: '/images/' + encodeURI(story.directory) + '/' + story.image.substring(story.image.lastIndexOf('\\') + 1),
        medium: '/images/' + encodeURI(story.directory) + '/' + story.image.substring(story.image.lastIndexOf('\\') + 1)
      },
      download: '/download/' + encodeURI(story.directory),
      download_count: 0,
      author: '',
      voice: '',
      designer: '',
      publisher: '',
      license: '',
      awards: [],
      created_at: '',
      updated_at: '',
      uuid: story.uuid,
      version: story.version || 0,
    }))

  const server = http.createServer((req, res) => {
    const httpUrl = 'http://' + req.headers.host

    if (req.method !== 'GET') {
      return resError404(res)
    }

    if (req.url === '/') {
      res.writeHead(200, {'Content-Type': 'application/json'})
      res.end(JSON.stringify({
        banner: {
          image: 'https://raw.githubusercontent.com/telmi-store/.github/refs/heads/master/profile/banner-telmi.jpg',
          background: '#2e144b',
          link: 'https://telmi.fr'
        },
        data: list.map((story) => ({
          ...story,
          thumbs: {
            small: httpUrl + story.thumbs.small,
            medium: httpUrl + story.thumbs.medium
          },
          download: httpUrl + story.download,
        }))
      }))
    } else if (req.url.startsWith('/images/')) {
      const
        [storyDir, imgFile] = req.url.substring(8).split('/'),
        imagePath = path.join(storiesPath, decodeURI(storyDir), imgFile)
      fs.readFile(imagePath, (err, data) => {
        if (err) {
          if (err.code === 'ENOENT') {
            return resError404(res)
          }
          return resError500(res, err)
        }

        res.writeHead(200, {
          'Content-Type': 'image/png',
          'Content-Length': data.length
        })
        res.end(data)
      })
    } else if (req.url.startsWith('/download/')) {
      const
        fileName = decodeURI(req.url.substring(10)),
        storyPath = path.join(storiesPath, fileName),
        zipFile = path.join(initTmpPath('zip-story'), Date.now().toString(36) + '.zip')
      pack(
        storyPath,
        zipFile,
        (err) => {
          if (err) {
            return resError500(res, err)
          }
          const fileStream = fs.createReadStream(zipFile)
          res.writeHead(200, {
            'Content-Type': 'application/zip',
            'Content-Disposition': 'attachment; filename="' + fileName + '.zip"',
            'Content-Length': fs.statSync(zipFile).size
          })
          fileStream.pipe(res)
          fileStream.on('error', (err) => {
            resError500(res, err)
          })
          fileStream.on('end', () => {
            fs.unlink(zipFile, () => {})
          })
        }
      )
    } else {
      resError404(res)
    }
  })

  server.listen(PORT, () => {
    const localIPs = getLocalIP()
    if (!localIPs.length) {
      process.stderr.write('No local ip found.')
      return
    }
    process.stdout.write('*server-launched*' + localIPs.join('|') + '**')
  })

  server.on('error', (err) => {
    process.stderr.write(err.toString())
  })
}

main()

