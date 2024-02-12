import { app, utilityProcess } from 'electron'
import * as url from 'url'
import * as path from 'path'

const
  __dirname = url.fileURLToPath(new URL('.', import.meta.url)),
  appPath = app.getAppPath()

function runProcess (jsFile, arrayParams, onSuccess, onProgress, onError, onFinished) {
  const
    taskProcess = utilityProcess.fork(
      path.join(__dirname, jsFile),
      ['[electron-apppath]' + (path.extname(appPath) !== '' ? path.dirname(appPath) : appPath), ...arrayParams.map(v => '[electron]' + v)],
      {stdio: 'pipe'}
    )

  taskProcess.stdout.on('data', data => {
    const progress = data.toString().split('*')
    console.log(progress)
    if (progress[progress.length - 1] === 'success') {
      taskProcess.kill()
      onSuccess()
    } else {
      if (progress.length < 5) {
        taskProcess.kill()
        onError()
      } else {
        onProgress(progress[progress.length - 4], progress[progress.length - 3], progress[progress.length - 2])
      }
    }
  })

  taskProcess.stderr.on('data', data => {
    console.log('RunProcess Error : ', data.toString())
    taskProcess.kill()
    onError(data.toString())
  })

  taskProcess.once('exit', (code) => {
    console.log('exit', code)
    onFinished()
  })

  return {
    process: taskProcess,
    params: arrayParams
  }
}

export default runProcess
