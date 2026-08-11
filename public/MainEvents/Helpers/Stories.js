import * as fs from 'fs'
import * as path from 'path'
import {rmDirectory} from './Files.js'
import {stringNormalizeFileName, stringSlugify} from './Strings.js'

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
      return {age: parseInt(b[1], 10), title: b[2].trim()}
    }
    const c = title.match(/(.*)\[([0-9]{1,2})\+]$/)
    if (c !== null) {
      return {age: parseInt(c[2], 10), title: c[1].trim()}
    }
    return {title}
  },

  getMetadataStory = (metadata, image) => {
    return Object.assign(
      {
        title: metadata.title,
        uuid: metadata.uuid,
        image,
        version: metadata.version || 0
      },
      metadata.category ? {category: metadata.category} : null,
      metadata.description ? {description: metadata.description} : null,
      metadata.age !== undefined ? {age: metadata.age} : null,
    )
  },

  createMetadataFile = (pathFile, metadata, image) => {
    fs.writeFileSync(pathFile, JSON.stringify(getMetadataStory(metadata, image)))
  },

  readStoryMetadata = (storiesPath, directory) => {
    const
      storyPath = path.join(storiesPath, directory),
      nodesPath = path.join(storyPath, 'nodes.json'),
      mdPath = path.join(storyPath, 'metadata.json'),
      mp3Path = path.join(storyPath, 'title.mp3'),
      pngPath = path.join(storyPath, 'title.png'),
      audiosPath = path.join(storyPath, 'audios'),
      imagesPath = path.join(storyPath, 'images')

    if (
      !fs.existsSync(nodesPath) || !fs.existsSync(mdPath) || !fs.existsSync(mp3Path) ||
      !fs.existsSync(pngPath) || !fs.existsSync(audiosPath) || !fs.existsSync(imagesPath)
    ) {
      rmDirectory(storyPath)
      return null
    }

    try {
      const
        md = JSON.parse(fs.readFileSync(mdPath).toString('utf8')),
        storyDirName = generateDirNameStory(md.title, md.uuid, md.age, md.category)

      if (storyDirName.toLowerCase() !== directory.toLowerCase()) {
        const newStoryPath = path.join(storiesPath, storyDirName)
        rmDirectory(newStoryPath)
        fs.renameSync(storyPath, newStoryPath)
        directory = storyDirName
      }

      md.directory = directory
      md.path = path.join(storiesPath, directory)
      md.image = path.join(md.path, md.image)
      md.audio = path.join(md.path, 'title.mp3')
      md.version = md.version || 0
      return md
    } catch (e) {
      console.log('Error parsing story : ' + directory)
      console.log(e.toString())
      return null
    }
  },
  readStories = (storiesPath) => {
    if (!fs.existsSync(storiesPath)) {
      return {stories: [], error:[]}
    }
    const list = fs.readdirSync(storiesPath)
      .reduce(
        (acc, d) => {
          const md = readStoryMetadata(storiesPath, d)
          return md !== null ? {...acc, stories: [...acc.stories, md]} : {...acc, error: [...acc.error, d]}
        },
        {stories: [], error:[]}
      )
    list.stories = list.stories.sort((md1, md2) => md1.directory > md2.directory ? 1 : (md1.directory < md2.directory ? -1 : 0))
    return list
  }

export {generateDirNameStory, findAgeInStoryName, getMetadataStory, createMetadataFile, readStoryMetadata, readStories}
