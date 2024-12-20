import {parseString} from 'xml2js'
import {request as requestHttps} from 'https'
import {request as requestHttp} from 'http'
import * as fs from 'fs'

const
  defaultHeader = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Connection': 'keep-alive',
    'language': 'fr',
    'User-Agent': 'TelmiSync/0.7.2 ( https://github.com/DantSu/Telmi-Sync )',
  },

  htmlTag = '<!DOCTYPE html>',

  downloadRangeFile = (url, filePath, resolve, reject, onProgress, bytesStart, bytesLength) => {
    if (bytesStart !== undefined && bytesStart > bytesLength) {
      return resolve(filePath)
    }

    try {
      const
        isHttps = url.substring(0, 6) === 'https:',
        request = isHttps ? requestHttps : requestHttp,
        bytesEnd = bytesStart !== undefined ? (bytesStart + 268435456) : undefined,
        file = fs.createWriteStream(filePath, {flags: 'a'}),
        req = request(
          url,
          {
            method: 'GET',
            rejectUnauthorized: false,
            timeout: 5000,
            headers: Object.assign(
              {...defaultHeader},
              bytesStart !== undefined ? {'Range': 'bytes=' + bytesStart + '-' + (bytesEnd - 1)} : null
            )
          },
          (res) => {
            if (res.statusCode < 200 || res.statusCode >= 400) {
              file.close()
              return reject(new Error('statusCode=' + res.statusCode + ' : ' + url))
            }

            if (res.statusCode >= 300 && res.statusCode < 400) {
              if (typeof res.headers['location'] === 'string' && res.headers['location'] !== url) {
                file.close()
                return downloadFile(res.headers['location'], filePath, onProgress)
                  .then((filePath) => resolve(filePath))
                  .catch((e) => reject(e))
              } else {
                file.close()
                return reject(new Error('statusCode=' + res.statusCode + ' : ' + url))
              }
            }

            let fileProgress = bytesStart || 0
            res.on('data', (d) => {
              fileProgress += d.length
              onProgress(Math.round(fileProgress / (bytesLength || fileProgress) * 100), 100)
            })

            res.pipe(file)
            file.on('finish', () => {
              file.close()
              if (fileProgress > 512000) {
                return downloadRangeFile(url, filePath, resolve, reject, onProgress, bytesEnd || 2, bytesLength || 1)
              }
              const content = fs.readFileSync(filePath).toString('utf8')
              if (content.substring(0, htmlTag.length) !== htmlTag) {
                return downloadRangeFile(url, filePath, resolve, reject, onProgress, bytesEnd || 2, bytesLength || 1)
              }
              const startPos = content.toLowerCase().indexOf(' url=') + 5
              if (startPos === -1) {
                return downloadRangeFile(url, filePath, resolve, reject, onProgress, bytesEnd || 2, bytesLength || 1)
              }
              const endPos = content.indexOf('"', startPos)
              if (endPos === -1) {
                return downloadRangeFile(url, filePath, resolve, reject, onProgress, bytesEnd || 2, bytesLength || 1)
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
      req.on('timeout', () => {
        file.close()
        reject(new Error('Unable to connect to : ' + url))
      })
      req.end()
    } catch (e) {
      reject(e)
    }
  },

  downloadFile = (url, filePath, onProgress) => {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(filePath)) {
        fs.rmSync(filePath)
      }

      const
        isHttps = url.substring(0, 6) === 'https:',
        request = isHttps ? requestHttps : requestHttp,
        req = request(
          url,
          {
            method: 'HEAD',
            timeout: 5000,
          },
          (res) => {
            if (res.statusCode < 200 || res.statusCode >= 400) {
              return reject(new Error('statusCode=' + res.statusCode + ' : ' + url))
            }

            if (res.statusCode >= 300 && res.statusCode < 400) {
              if (typeof res.headers['location'] === 'string' && res.headers['location'] !== url) {
                return downloadFile(res.headers['location'], filePath, onProgress)
                  .then((filePath) => resolve(filePath))
                  .catch((e) => reject(e))
              } else {
                return reject(new Error('statusCode=' + res.statusCode + ' : ' + url))
              }
            }

            if (res.headers['accept-ranges'] === 'bytes' && res.headers['content-length'] !== undefined) {
              downloadRangeFile(url, filePath, resolve, reject, onProgress, 0, res.headers['content-length'])
            } else {
              downloadRangeFile(url, filePath, resolve, reject, onProgress)
            }
          }
        )
      req.on('error', e => {
        reject(e)
      })
      req.on('timeout', () => {
        reject(new Error('Unable to connect to : ' + url))
      })
      req.end()
    })
  },

  requestData = (url, header) => {
    return new Promise((resolve, reject) => {
      const
        isHttps = url.substring(0, 6) === 'https:',
        request = isHttps ? requestHttps : requestHttp,
        req = request(
          url,
          {
            method: 'GET',
            rejectUnauthorized: false,
            timeout: 5000,
            headers: {
              ...defaultHeader,
              ...header
            }
          },
          res => {
            if (res.statusCode < 200 || res.statusCode >= 400) {
              return reject(new Error('statusCode=' + res.statusCode + ' : ' + url))
            }

            if (res.statusCode >= 300 && res.statusCode < 400) {
              if (typeof res.headers['location'] === 'string' && res.headers['location'] !== url) {
                return requestData(res.headers['location'], header)
                  .then((buffer) => resolve(buffer))
                  .catch((e) => reject(e))
              } else {
                return reject(new Error('statusCode=' + res.statusCode + ' : ' + url))
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
      req.on('timeout', () => {
        reject(new Error('Unable to connect to : ' + url))
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
        'Access-Control-Max-Age': '1800',
      }
    )
      .then(data => JSON.parse(data.toString('utf-8')))
  },
  requestJsonOrXml = (url, header) => {
    return new Promise((resolve, reject) => {
      requestData(
        url,
        {
          ...header,
          'Accept': 'application/json, text/xml, application/xml',
          'Access-Control-Max-Age': '1800',
        }
      )
        .then(data => {
          const utf8String = data.toString('utf-8')
          try {
            resolve(JSON.parse(utf8String))
          } catch (ignored) {
            try {
              parseString(utf8String, function (err, result) {
                if (err) {
                  return reject(err)
                }
                resolve(result)
              })
            } catch (e) {
              reject(e)
            }
          }
        })
    })
  }

export {requestData, requestJson, requestJsonOrXml, downloadFile}
