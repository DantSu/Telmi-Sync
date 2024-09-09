import {stringNormalizeFileName, stringSlugify} from './Strings.js'
import fs from 'fs'

const
  generateDirNameStory = (title, uuid, age, category) => {
    return stringNormalizeFileName(category || '').substring(0, 32) + '_' +
      (age === undefined ? '' : (age < 10 ? '0' : '') + age).substring(0, 2) + '_' +
      stringNormalizeFileName(title).substring(0, 32) + '_' +
      stringSlugify(uuid).substring(0, 36)
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
  },

  getMetadataStory = (metadata, image) => {
    return Object.assign(
      {
        title: metadata.title,
        uuid: metadata.uuid,
        image,
      },
      metadata.category ? {category: metadata.category} : null,
      metadata.description ? {description: metadata.description} : null,
      metadata.age !== undefined ? {age: metadata.age} : null,
    )
  },

  createMetadataFile = (pathFile, metadata, image) => {
    fs.writeFileSync(pathFile, JSON.stringify(getMetadataStory(metadata, image)))
  }

export {generateDirNameStory, findAgeInStoryName, getMetadataStory, createMetadataFile}
