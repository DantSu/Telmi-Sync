import fs from 'fs'
import path from 'path'
import {getProcessParams} from '../Helpers/ProcessParams.js'
import {getExtraResourcesPath, getStoriesPath} from '../Helpers/AppPaths.js'
import {generateDirNameStory} from '../../Helpers/Stories.js'
import {createPathDirectories, rmFile} from '../../Helpers/Files.js'
import {convertCoverImage, convertInventoryImages, convertStoryImages} from '../Import/Helpers/ImageFile.js'
import {convertAudios} from '../Import/Helpers/AudioFile.js'


const
  defaultItemImage = path.join(getExtraResourcesPath(), 'assets', 'images', 'unknow-item.png'),

  isValidPath = (pathFile) => typeof pathFile === 'string' && pathFile !== '' && fs.existsSync(pathFile),
  checkNew = (dstPath, stageKey, pathFile, ext, arr) => {
    if (!isValidPath(pathFile)) {
      return arr
    }
    return {
      src: [...arr.src, pathFile],
      dst: [...arr.dst, path.join(dstPath, stageKey + '.' + ext)]
    }
  },
  checkNewImage = (dstPath, stageKey, stage, arr) => checkNew(dstPath, stageKey, stage.newImage, 'png', arr),
  checkNewAudio = (dstPath, stageKey, stage, arr) => checkNew(dstPath, stageKey, stage.newAudio, 'mp3', arr),
  getFileName = (stageKey, file, newFile, ext) => (isValidPath(newFile) ? (stageKey + '.' + ext) : file) || null,
  checkExisting = (stageKey, file, newFile, ext, obj) => {
    const fileName = getFileName(stageKey, file, newFile, ext)
    return fileName === null ? obj : {...obj, [fileName]: true}
  },
  getImageName = (stageKey, stage) => getFileName(stageKey, stage.image, stage.newImage, 'png'),
  getAudioName = (stageKey, stage) => getFileName(stageKey, stage.audio, stage.newAudio, 'mp3'),
  checkExistingImage = (stageKey, stage, obj) => checkExisting(stageKey, stage.image, stage.newImage, 'png', obj),
  checkExistingAudio = (stageKey, stage, obj) => checkExisting(stageKey, stage.audio, stage.newAudio, 'mp3', obj),

  isOtherStageUseAction = (nodes, actionKey, stageKey) => {
    return Object.keys(nodes.stages).find(
      (sKey) => sKey !== stageKey && (
        (nodes.stages[sKey].ok !== null && nodes.stages[sKey].ok.action === actionKey) ||
        (nodes.stages[sKey].home !== null && nodes.stages[sKey].home.action === actionKey)
      )
    ) !== undefined
  },

  removeOrphanNodes = (nodes) => {
    const
      usedStages = Object.values(nodes.actions).reduce(
        (acc, action) => ({
          ...acc,
          ...action.reduce((acc, option) => ({...acc, [option.stage]: true}), {})
        }),
        {}
      ),
      unusedStages = Object.keys(nodes.stages).reduce(
        (acc, stageKey) => usedStages[stageKey] ? acc : [...acc, stageKey],
        []
      )

    if (!unusedStages.length) {
      return nodes
    }

    while (unusedStages.length) {
      const
        stageKey = unusedStages.shift(),
        stage = nodes.stages[stageKey]

      if (stage.ok !== null && !isOtherStageUseAction(nodes, stage.ok.action, stageKey)) {
        delete nodes.actions[stage.ok.action]
      }
      if (stage.home !== null && stage.home.action !== stage.ok.action && !isOtherStageUseAction(nodes, stage.home.action, stageKey)) {
        delete nodes.actions[stage.ok.action]
      }
      delete nodes.stages[stageKey]
    }

    removeOrphanNodes(nodes)
  },

  saveStoryCoverImage = (newImageCover, imageCoverPath) => {
    if (typeof newImageCover !== 'string' || newImageCover === '') {
      return process.stdout.write('success')
    }
    convertCoverImage(newImageCover, imageCoverPath)
      .then(() => {
        process.stdout.write('success')
      })
      .catch(() => {
        process.stderr.write('file-not-found')
      })
  }


function main(jsonPath) {
  try {
    process.stdout.write('*story-saving*0*100*')
    const
      {metadata, nodes, notes} = JSON.parse(fs.readFileSync(jsonPath).toString('utf-8')),
      storyPath = getStoriesPath(generateDirNameStory(metadata.title, metadata.uuid, metadata.age, metadata.category)),
      imagesPath = path.join(storyPath, 'images'),
      audiosPath = path.join(storyPath, 'audios')

    if (metadata.path === undefined || !fs.existsSync(metadata.path)) {
      createPathDirectories(imagesPath)
      createPathDirectories(audiosPath)
    } else if (metadata.path !== storyPath) {
      fs.renameSync(metadata.path, storyPath)
    }

    removeOrphanNodes(nodes)

    process.stdout.write('*story-saving*1*100*')

    const
      audioTitlePath = path.join(storyPath, 'title.mp3'),
      imageTitlePath = path.join(storyPath, 'title.png'),
      imageCoverPath = path.join(storyPath, 'cover.png'),

      isNewImageTitleUploaded = isValidPath(metadata.newImageTitle),
      isNewCoverUploaded = isValidPath(metadata.newImageCover),
      isNewAudioTitleUploaded = isValidPath(metadata.newAudioTitle),
      hasCover = isNewCoverUploaded || fs.existsSync(imageCoverPath),

      files = Object.keys(nodes.stages).reduce(
        (acc, stageKey) => ({
          newImages: checkNewImage(imagesPath, stageKey, nodes.stages[stageKey], acc.newImages),
          existingImages: checkExistingImage(stageKey, nodes.stages[stageKey], acc.existingImages),
          newAudios: checkNewAudio(audiosPath, stageKey, nodes.stages[stageKey], acc.newAudios),
          existingAudios: checkExistingAudio(stageKey, nodes.stages[stageKey], acc.existingAudios)
        }),
        {
          newImages: isNewImageTitleUploaded ? {src: [metadata.newImageTitle], dst: [imageTitlePath]} : {
            src: [],
            dst: []
          },
          existingImages: {},
          newAudios: isNewAudioTitleUploaded ? {src: [metadata.newAudioTitle], dst: [audioTitlePath]} : {
            src: [],
            dst: []
          },
          existingAudios: {}
        }
      ),
      cleanNodes = {startAction: nodes.startAction},
      hasInventory = Array.isArray(nodes.inventory) && nodes.inventory.length,
      mapInventory = hasInventory ? nodes.inventory.reduce((acc, item, k) => ({...acc, [item.id]: k}), {}) : {}

    process.stdout.write('*story-saving*2*100*')

    if (hasInventory) {
      files.newInventoryImages = {src: [], dst: []}
      nodes.inventory.forEach((item, k) => {
        const
          imageName = 'i' + k + '.png',
          imageTmpName = 'tmp' + imageName

        if (typeof item.image === 'string' && item.image !== '' && item.image !== imageName) {
          fs.renameSync(path.join(imagesPath, item.image), path.join(imagesPath, imageTmpName))
          item.image = imageTmpName
        }
      })
      cleanNodes.inventory = nodes.inventory.map(
        (item, k) => {
          const imageName = 'i' + k + '.png'
          files.existingImages[imageName] = true
          if (isValidPath(item.newImage)) {
            files.newInventoryImages = {
              src: [...files.newInventoryImages.src, item.newImage],
              dst: [...files.newInventoryImages.dst, path.join(imagesPath, imageName)]
            }
          } else if (!isValidPath(path.join(imagesPath, item.image))) {
            fs.copyFileSync(defaultItemImage, path.join(imagesPath, imageName))
          } else if (item.image !== imageName) {
            fs.renameSync(path.join(imagesPath, item.image), path.join(imagesPath, imageName))
          }
          return {
            name: item.name,
            initialNumber: item.initialNumber,
            maxNumber: item.maxNumber,
            display: item.display,
            image: imageName,
          }
        }
      )
    }

    const countFiles = files.newImages.src.length + files.newAudios.src.length + 9

    process.stdout.write('*story-saving*3*' + countFiles + '*')

    cleanNodes.stages = Object.keys(nodes.stages).reduce(
      (acc, stageKey) => {
        const stage = nodes.stages[stageKey]
        return {
          ...acc,
          [stageKey]: Object.assign(
            {
              image: getImageName(stageKey, stage),
              audio: getAudioName(stageKey, stage),
              ok: stage.ok,
              home: stage.home,
              control: stage.control
            },
            hasInventory && Array.isArray(stage.items) && stage.items.length ? {
              items: stage.items.map((i) => ({
                type: i.type,
                item: mapInventory[i.item],
                number: i.number
              }))
            } : null
          )
        }
      },
      {}
    )

    process.stdout.write('*story-saving*4*' + countFiles + '*')

    cleanNodes.actions = Object.keys(nodes.actions).reduce(
      (acc, actionKey) => {
        const action = nodes.actions[actionKey]
        return {
          ...acc,
          [actionKey]: action.map(
            (option) => Object.assign(
              {stage: option.stage},
              hasInventory && Array.isArray(option.conditions) && option.conditions.length ? {
                conditions: option.conditions.map((i) => ({
                  comparator: i.comparator,
                  item: mapInventory[i.item],
                  number: i.number
                }))
              } : null
            )
          )
        }
      },
      {}
    )

    process.stdout.write('*story-saving*5*' + countFiles + '*')

    const metadataPath = path.join(storyPath, 'metadata.json')
    rmFile(metadataPath)
    fs.writeFileSync(
      metadataPath,
      JSON.stringify({
        title: metadata.title,
        description: metadata.description,
        uuid: metadata.uuid,
        age: metadata.age,
        category: metadata.category,
        image: hasCover ? 'cover.png' : 'title.png'
      })
    )

    process.stdout.write('*story-saving*6*' + countFiles + '*')

    const nodesPath = path.join(storyPath, 'nodes.json')
    rmFile(nodesPath)
    fs.writeFileSync(nodesPath, JSON.stringify(cleanNodes))

    process.stdout.write('*story-saving*7*' + countFiles + '*')

    const
      cleanNotes = Object.keys(notes).reduce(
        (acc, stageKey) => cleanNodes.stages[stageKey] === undefined ? acc : {...acc, [stageKey]: notes[stageKey]},
        {}
      ),
      notesPath = path.join(storyPath, 'notes.json')
    rmFile(notesPath)
    fs.writeFileSync(notesPath, JSON.stringify(cleanNotes))

    process.stdout.write('*story-saving*8*' + countFiles + '*')

    const imagesFiles = fs.readdirSync(imagesPath, {encoding: 'utf8'})
    for (const file of imagesFiles) {
      if (files.existingImages[file] === undefined) {
        rmFile(path.join(imagesPath, file))
      }
    }

    const audiosFiles = fs.readdirSync(audiosPath, {encoding: 'utf8'})
    for (const file of audiosFiles) {
      if (files.existingAudios[file] === undefined) {
        rmFile(path.join(audiosPath, file))
      }
    }

    process.stdout.write('*story-saving*9*' + countFiles + '*')

    convertStoryImages(
      files.newImages.src,
      files.newImages.dst,
      9,
      countFiles,
      (index) => convertAudios(
        files.newAudios.src,
        files.newAudios.dst,
        index,
        countFiles,
        (index) => {
          if (!hasInventory) {
            return saveStoryCoverImage(metadata.newImageCover, imageCoverPath)
          }
          convertInventoryImages(
            files.newInventoryImages.src,
            files.newInventoryImages.dst,
            index,
            countFiles,
            () => saveStoryCoverImage(metadata.newImageCover, imageCoverPath),
            false
          )
        },
        false
      )
    )
  } catch (e) {
    process.stderr.write(e.toString())
  }
}

const _params_ = getProcessParams()

if (_params_.length === 0) {
  process.stderr.write('no-file')
} else {
  main(_params_.shift())
}

