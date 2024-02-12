import { request } from 'https'
import * as fs from 'fs'

const
  defaultHeader = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Connection': 'keep-alive',
    'language': 'fr',
    'User-Agent': 'TelmiSync/0.0.0 ( https://github.com/DantSu/Telmi-Sync )',
  },

  htmlTag = '<!DOCTYPE html>',

  downloadFile = (url, filePath, onProgress) => {
    return new Promise((resolve, reject) => {
      try {
        const
          file = fs.createWriteStream(filePath),
          req = request(
            url,
            {
              method: 'GET',
              protocol: 'https:',
              port: 443,
              rejectUnauthorized: false,
              headers: {...defaultHeader}
            },
            res => {
              if (res.statusCode < 200 || res.statusCode >= 400) {
                file.close()
                return reject(new Error('statusCode=' + res.statusCode))
              }

              if (res.statusCode >= 300 && res.statusCode < 400) {
                if (typeof res.headers['location'] === 'string' && res.headers['location'] !== url) {
                  file.close()
                  return downloadFile(res.headers['location'], filePath, onProgress)
                    .then((filePath) => resolve(filePath))
                    .catch((e) => reject(e))
                } else {
                  file.close()
                  return reject(new Error('statusCode=' + res.statusCode))
                }
              }

              const fileLength = res.headers['content-length']
              let fileProgress = 0
              res.on('data', (d) => {
                fileProgress += d.length
                onProgress(Math.round(fileProgress / (fileLength || fileProgress) * 100), 100)
              })

              res.pipe(file)
              file.on('finish', () => {
                file.close()
                if (fileProgress > 10000) {
                  return resolve(filePath)
                }
                const content = fs.readFileSync(filePath).toString('utf8')
                if (content.substring(0, htmlTag.length) !== htmlTag) {
                  return resolve(filePath)
                }
                const startPos = content.toLowerCase().indexOf(' url=') + 5
                if (startPos === -1) {
                  return resolve(filePath)
                }
                const endPos = content.indexOf('"', startPos)
                if (endPos === -1) {
                  return resolve(filePath)
                }
                return downloadFile(content.substring(startPos, endPos), filePath, onProgress)
                  .then((filePath) => resolve(filePath))
                  .catch((e) => reject(e))
              })
            }
          )
        req.on('error', e => {
          file.close()
          reject(e)
        })
        req.end()
      } catch (e) {
        reject(e)
      }
    })
  },

  requestData = (url, header) => {
    return new Promise((resolve, reject) => {
      const req = request(
        url,
        {
          method: 'GET',
          protocol: 'https:',
          port: 443,
          rejectUnauthorized: false,
          headers: {
            ...defaultHeader,
            ...header
          }
        },
        res => {
          if (res.statusCode < 200 || res.statusCode >= 400) {
            return reject(new Error('statusCode=' + res.statusCode))
          }

          if (res.statusCode >= 300 && res.statusCode < 400) {
            if (typeof res.headers['location'] === 'string' && res.headers['location'] !== url) {
              return requestData(res.headers['location'], header)
                .then((buffer) => resolve(buffer))
                .catch((e) => reject(e))
            } else {
              return reject(new Error('statusCode=' + res.statusCode))
            }
          }

          let data = []
          res.on('data', (d) => {
            data.push(d)
          })
          res.on('end', () => {
            try {
              resolve(Buffer.concat(data))
            } catch (e) {
              reject(e)
            }
          })
        }
      )
      req.on('error', e => {
        reject(e)
      })
      req.end()
    })
  },
  requestJson = (url, header) => {
    return requestData(
      url,
      {
        ...header,
        'Accept': 'application/json',
        'Access-Control-Max-Age': '1728000',
      }
    )
      .then(data => JSON.parse(data.toString('utf-8')))
  }

export { requestData, requestJson, downloadFile }
