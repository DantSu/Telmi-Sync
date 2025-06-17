import fs from 'fs'
import path from 'path'
import {getProcessParams} from '../Helpers/ProcessParams.js'
import {getExtraResourcesPath, getStoriesPath} from '../Helpers/AppPaths.js'
import {createMetadataFile, generateDirNameStory} from '../../Helpers/Stories.js'
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

  removeOrphanNodes = (nodes) => {
    const
      usedStages = {},
      usedActions = {[nodes.startAction.action]: true},
      actions = Object.keys(usedActions)

    if (nodes.stages.backStage !== undefined) {
      usedActions['backAction'] = true
      actions.push('backAction')
    }

    while (actions.length) {
      const aKey = actions.shift()
      nodes.actions[aKey].forEach((a) => {
        const sKey = a.stage
        usedStages[sKey] = true
        const stage = nodes.stages[sKey]
        if (stage === undefined) {
          return
        }
        if (stage.ok !== null && usedActions[stage.ok.action] === undefined) {
          usedActions[stage.ok.action] = true
          actions.push(stage.ok.action)
        }
        if (stage.home !== null && usedActions[stage.home.action] === undefined) {
          usedActions[stage.home.action] = true
          actions.push(stage.home.action)
        }
      })
    }
    Object.keys(nodes.stages).forEach(
      (stageKey) => usedStages[stageKey] === undefined && delete nodes.stages[stageKey]
    )
    Object.keys(nodes.actions).forEach(
      (actionKey) => usedActions[actionKey] === undefined && delete nodes.actions[actionKey]
    )
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

    process.stdout.write('*story-saving*1*100*')

    removeOrphanNodes(nodes)

    process.stdout.write('*story-saving*2*100*')

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

    process.stdout.write('*story-saving*3*100*')

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
          } else if (typeof item.image !== 'string' || item.image === '' || !isValidPath(path.join(imagesPath, item.image))) {
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

    const countFiles = files.newImages.src.length + files.newAudios.src.length + 10

    process.stdout.write('*story-saving*4*' + countFiles + '*')

    cleanNodes.stages = Object.keys(nodes.stages).reduce(
      (acc, stageKey) => {
        const stage = nodes.stages[stageKey]
        return {
          ...acc,
          [stageKey]: Object.assign(
            {
              image: getImageName(stageKey, stage),
              audio: getAudioName(stageKey, stage),
              ok: hasInventory && stage.ok !== null && stage.ok.indexItem !== undefined ? {
                ...stage.ok,
                indexItem: mapInventory[stage.ok.indexItem]
              } : stage.ok,
              home: stage.home,
              control: stage.control
            },
            hasInventory && stage.inventoryReset ? {inventoryReset: true} : null,
            hasInventory && Array.isArray(stage.items) && stage.items.length ? {
              items: stage.items.map((i) => Object.assign(
                {
                  type: i.type,
                  item: mapInventory[i.item],
                },
                i.number !== undefined ? {number: i.number} : null,
                i.assignItem !== undefined ? {assignItem: mapInventory[i.assignItem]} : null,
                i.playingTime ? {playingTime: true} : null
              ))
            } : null
          )
        }
      },
      {}
    )

    process.stdout.write('*story-saving*5*' + countFiles + '*')

    cleanNodes.actions = Object.keys(nodes.actions).reduce(
      (acc, actionKey) => {
        const action = nodes.actions[actionKey]
        return {
          ...acc,
          [actionKey]: action.map(
            (option) => Object.assign(
              {stage: option.stage},
              hasInventory && Array.isArray(option.conditions) && option.conditions.length ? {
                conditions: option.conditions.map((i) => Object.assign({
                    comparator: i.comparator,
                    item: mapInventory[i.item]
                  },
                  i.number !== undefined ? {number: i.number} : null,
                  i.compareItem !== undefined ? {compareItem: mapInventory[i.compareItem]} : null
                ))
              } : null
            )
          )
        }
      },
      {}
    )

    process.stdout.write('*story-saving*6*' + countFiles + '*')

    metadata.version++
    const metadataPath = path.join(storyPath, 'metadata.json')
    createMetadataFile(metadataPath, metadata, hasCover ? 'cover.png' : 'title.png')

    process.stdout.write('*story-saving*7*' + countFiles + '*')

    const nodesPath = path.join(storyPath, 'nodes.json')
    fs.writeFileSync(nodesPath, JSON.stringify(cleanNodes))

    process.stdout.write('*story-saving*8*' + countFiles + '*')

    const removeUnusedFiles = (index) => {
      process.stdout.write('*story-cleaning*' + (index++) + '*' + countFiles + '*')

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

      process.stdout.write('*picture-cover*' + index + '*' + countFiles + '*')

      saveStoryCoverImage(metadata.newImageCover, imageCoverPath)
    }

    const
      cleanNotes = Object.keys(notes).reduce(
        (acc, stageKey) => cleanNodes.stages[stageKey] === undefined ? acc : {...acc, [stageKey]: notes[stageKey]},
        {}
      ),
      notesPath = path.join(storyPath, 'notes.json')
    fs.writeFileSync(notesPath, JSON.stringify(cleanNotes))

    process.stdout.write('*story-saving*9*' + countFiles + '*')

    convertStoryImages(
      files.newImages.src,
      files.newImages.dst,
      null,
      null,
      9,
      countFiles,
      (index) => convertAudios(
        files.newAudios.src,
        files.newAudios.dst,
        index,
        countFiles,
        (index) => {
          if (!hasInventory) {
            return removeUnusedFiles(index)
          }
          convertInventoryImages(
            files.newInventoryImages.src,
            files.newInventoryImages.dst,
            index,
            countFiles,
            () => removeUnusedFiles(index),
            false
          )
        },
        false,
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

