import * as fs from 'fs'
import * as path from 'path'

const
  isDirectory = (dir) => {
    return fs.existsSync(dir) && fs.lstatSync(dir).isDirectory()
  },
  createPathDirectories = (dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {recursive: true})
    }
  },
  rmDirectory = (dir) => {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, {recursive: true})
    }
  },
  rmFile = (file) => {
    rmDirectory(file)
  },
  recursiveCountFiles = (dir) => {
    if(!isDirectory(dir)) {
      return 0
    }
    return fs
      .readdirSync(dir, {encoding: 'utf8', recursive: true})
      .reduce((acc, f) => fs.lstatSync(path.join(dir, f)).isDirectory() ? acc : acc + 1, 0)
  }

export { isDirectory, createPathDirectories, rmFile, rmDirectory, recursiveCountFiles }
