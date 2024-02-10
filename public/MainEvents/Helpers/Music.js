import { stringNormalizeFileName } from './Strings.js'

const
  musicObjectToName = (data) => {
    return Object.values(data).map((v) => stringNormalizeFileName(v)).join('_')
  },
  musicNameToObject = (name) => {
    const data = name.split('_')
    return {
      artist: data[0],
      album: data[1],
      track: data[2],
      title: data[3],
    }
  }

export { musicObjectToName, musicNameToObject }
