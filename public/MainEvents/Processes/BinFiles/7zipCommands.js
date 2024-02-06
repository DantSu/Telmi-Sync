import { spawn } from 'child_process'
import { getElectronAppPath } from '../Helpers/AppPaths.js'
import * as path from 'path'

const
  get7zipFileName = () => {
    return process.platform === 'win32' ? '7za.exe' : '7za'
  },

  get7zipFilePath = () => {
    return path.join(getElectronAppPath(), 'extraResources', '7zip', process.platform, process.arch, get7zipFileName())
  },

  path7za = get7zipFilePath(),

  onceify = (fn) => {
    let called = false
    return function () {
      if (called) return
      called = true
      fn.apply(this, Array.prototype.slice.call(arguments)) // slice arguments
    }
  },

  parseListOutput = (str) => {
    if (!str.length) return []
    str = str.replace(/(\r\n|\n|\r)/gm, '\n')
    const items = str.split(/^\s*$/m)
    const res = []
    const LIST_MAP = {
      'Path': 'name',
      'Size': 'size',
      'Packed Size': 'compressed',
      'Attributes': 'attr',
      'Modified': 'dateTime',
      'CRC': 'crc',
      'Method': 'method',
      'Block': 'block',
      'Encrypted': 'encrypted',
    }

    if (!items.length) return []

    for (let item of items) {
      if (!item.length) continue
      const obj = {}
      const lines = item.split('\n')
      if (!lines.length) continue
      for (let line of lines) {
        // Split by first " = " occurrence. This will also add an empty 3rd elm to the array. Just ignore it
        const data = line.split(/ = (.*)/s)
        if (data.length !== 3) continue
        const name = data[0].trim()
        const val = data[1].trim()
        if (LIST_MAP[name]) {
          if (LIST_MAP[name] === 'dateTime') {
            const dtArr = val.split(' ')
            if (dtArr.length !== 2) continue
            obj['date'] = dtArr[0]
            obj['time'] = dtArr[1]
          } else {
            obj[LIST_MAP[name]] = val
          }
        }
      }
      if (Object.keys(obj).length) res.push(obj)
    }
    return res
  },

  run = (bin, args, cb) => {
    cb = onceify(cb)
    const runError = new Error() // get full stack trace
    const proc = spawn(bin, args, {windowsHide: true})
    let output = ''
    proc.on('error', function (err) {
      cb(err)
    })
    proc.on('exit', function (code) {
      let result = null
      if (args[0] === 'l') {
        result = parseListOutput(output)
      }
      if (code) {
        runError.message = `7-zip exited with code ${code}\n${output}`
      }
      cb(code ? runError : null, result)
    })
    proc.stdout.on('data', (chunk) => {
      output += chunk.toString()
    })
    proc.stderr.on('data', (chunk) => {
      output += chunk.toString()
    })
  },

  unpack = (pathToPack, destPathOrCb, cb) => {
    run(path7za, ['x', pathToPack, '-y', '-o' + destPathOrCb], cb)
  },

  list = (pathToSrc, cb) => {
    run(path7za, ['l', '-slt', '-ba', pathToSrc], cb)
  }

export { get7zipFilePath, list, unpack }
