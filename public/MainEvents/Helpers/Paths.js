import {execSync} from 'child_process'

function getShortPath(homePath) {
  if (process.platform !== 'win32') {
    return homePath
  }
  return execSync(`for %I in ("${homePath}") do @echo %~sI`, {shell: 'cmd.exe'}).toString().trim()
}

export {getShortPath}