import { stringNormalizeFileName, stringSlugify } from '../../Helpers/Strings.js'

const
  generateDirNameStory = (title, uuid, age, category) => {
    return stringNormalizeFileName(category || '').substring(0, 32) + '_' + (age === undefined ? '' : age + '').substring(0, 2) + '_' + stringNormalizeFileName(title).substring(0, 32) + '_' + stringSlugify(uuid).substring(0, 36)
  },
  findAgeInStoryName = (title) => {
    const a = title.match(/^([0-9]{1,2})\+](.*)/)
    if (a !== null) {
      return {age: parseInt(a[1], 10), title: a[2].trim()}
    }
    const b = title.match(/^\[([0-9]{1,2})\+](.*)/)
    if (b !== null) {
      return {age: parseInt(a[1], 10), title: b[2].trim()}
    }
    const c = title.match(/(.*)\[([0-9]{1,2})\+]$/)
    if (c !== null) {
      return {age: parseInt(a[2], 10), title: c[1].trim()}
    }
    return {title}
  }

export { generateDirNameStory, findAgeInStoryName }
