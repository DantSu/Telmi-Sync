import * as path from 'path'
import * as fs from 'fs'
import { decipherXXTEA } from './Helpers/XXTEACipher.js'
import { createPathDirectories, rmDirectory } from '../../Helpers/Files.js'
import { getStoriesPath, initTmpPath } from '../Helpers/AppPaths.js'
import { convertStoryImages } from './Helpers/ImageFile.js'
import { stringSlugify } from '../../Helpers/Strings.js'
import { findAgeInStoryName, generateDirNameStory } from '../Helpers/Stories.js'
import { convertAudios } from './Helpers/AudioFile.js'

const
  varsToTransitionNode = (transitionActionNodeIndexInLI, transitionNumberOfOptions, transitionSelectedOptionIndex, actionNodeKey) => {
    if (transitionActionNodeIndexInLI === -1 || transitionNumberOfOptions === -1 || transitionSelectedOptionIndex === -1) {
      return null
    }
    return {
      action: actionNodeKey,
      index: transitionSelectedOptionIndex
    }
  },
  decipherMedias = (srcMedias, dstMedias, index, length, onEnd) => {
    if (!srcMedias.length) {
      onEnd(index)
      return
    }

    const
      srcMedia = srcMedias.shift(),
      dstMedia = dstMedias.shift()

    process.stdout.write('*story-deciphering-media*' + index + '*' + length + '*')

    fs.writeFileSync(dstMedia, decipherXXTEA(fs.readFileSync(srcMedia)))
    decipherMedias(srcMedias, dstMedias, index + 1, length, onEnd)
  }

function convertFolderFS (srcPath, storyName) {
  process.stdout.write('*story-reading-metadata*1*100*')

  const
    ri = decipherXXTEA(fs.readFileSync(path.join(srcPath, 'ri'))).toString('utf8').match(/.{12}/g),
    si = decipherXXTEA(fs.readFileSync(path.join(srcPath, 'si'))).toString('utf8').match(/.{12}/g),
    countFiles = ri.length * 2 + si.length * 2 + 1

  process.stdout.write('*story-reading-metadata*1*' + countFiles + '*')

  const

    findNewName = (currentName, suffix, objectNames) => {
      if (!currentName) {
        return null
      }
      const cn = currentName.replace('\\', '-').toLowerCase()
      if (objectNames[cn] === undefined) {
        objectNames[cn] = Object.values(objectNames).length + suffix
      }
      return objectNames[cn]
    },
    imagesNewNames = {},
    audiosNewNames = {},

    renameImage = (name) => findNewName(name, '.png', imagesNewNames),
    renameAudio = (name) => findNewName(name, '.mp3', audiosNewNames),
    renameToTmp = (prefix, name) => prefix + '_' + name.replace('\\', '_'),
    renameToTmpImage = (name) => renameToTmp('IMG', name),
    renameToTmpAudio = (name) => renameToTmp('AUD', name),

    tmpUuid = stringSlugify(path.basename(srcPath)),
    uuid = tmpUuid.length > 36 ? tmpUuid.substring(0, 36) : tmpUuid,
    {age, title} = findAgeInStoryName(storyName || path.basename(srcPath)),
    dstPath = getStoriesPath(generateDirNameStory(title, uuid, age)),
    srcImagesPath = path.join(srcPath, 'rf'),
    srcAudiosPath = path.join(srcPath, 'sf'),
    dstImagesPath = path.join(dstPath, 'images'),
    dstAudiosPath = path.join(dstPath, 'audios'),

    ni = fs.readFileSync(path.join(srcPath, 'ni')),
    li = decipherXXTEA(fs.readFileSync(path.join(srcPath, 'li'))),

    // fileFormatVersion = ni.readInt16LE(0),
    // storyVersion = ni.readInt16LE(2),
    nodeList = ni.readInt32LE(4),
    nodeSize = ni.readInt32LE(8),
    stageNodesCount = ni.readInt32LE(12),
    // imageAssetsCount = ni.readInt32LE(16),
    // soundAssetsCount = ni.readInt32LE(20),
    stages = {},
    actions = {},

    setActionNodes = (actionNodeKey, transitionActionNodeIndexInLI, transitionNumberOfOptions) => {
      if (transitionActionNodeIndexInLI === -1 || transitionNumberOfOptions === -1) {
        return
      }
      if (actions[actionNodeKey] === undefined) {
        actions[actionNodeKey] = []
        for (let j = 0; j < transitionNumberOfOptions; j++) {
          actions[actionNodeKey].push({stage: 's' + li.readInt32LE(transitionActionNodeIndexInLI * 4 + j * 4)})
        }
      }
    }

  for (let i = 0; i < stageNodesCount; ++i) {
    const
      bytesOffset = nodeList + i * nodeSize,
      imageAssetIndexInRI = ni.readInt32LE(bytesOffset),
      soundAssetIndexInSI = ni.readInt32LE(bytesOffset + 4),
      okTransitionActionNodeIndexInLI = ni.readInt32LE(bytesOffset + 8),
      okTransitionNumberOfOptions = ni.readInt32LE(bytesOffset + 12),
      okTransitionSelectedOptionIndex = ni.readInt32LE(bytesOffset + 16),
      homeTransitionActionNodeIndexInLI = ni.readInt32LE(bytesOffset + 20),
      homeTransitionNumberOfOptions = ni.readInt32LE(bytesOffset + 24),
      homeTransitionSelectedOptionIndex = ni.readInt32LE(bytesOffset + 28),
      wheel = ni.readInt16LE(bytesOffset + 32) !== 0,
      ok = ni.readInt16LE(bytesOffset + 34) !== 0,
      home = ni.readInt16LE(bytesOffset + 36) !== 0,
      pause = ni.readInt16LE(bytesOffset + 38) !== 0,
      autoplay = ni.readInt16LE(bytesOffset + 40) !== 0,
      stageNodeKey = 's' + i,
      okActionNodeKey = 'a' + okTransitionActionNodeIndexInLI + '.' + okTransitionNumberOfOptions,
      homeActionNodeKey = 'a' + homeTransitionActionNodeIndexInLI + '.' + homeTransitionNumberOfOptions

    stages[stageNodeKey] = {
      image: renameImage(ri[imageAssetIndexInRI]),
      audio: renameAudio(si[soundAssetIndexInSI]),
      ok: varsToTransitionNode(
        okTransitionActionNodeIndexInLI,
        okTransitionNumberOfOptions,
        okTransitionSelectedOptionIndex,
        okActionNodeKey
      ),
      home: varsToTransitionNode(
        homeTransitionActionNodeIndexInLI,
        homeTransitionNumberOfOptions,
        homeTransitionSelectedOptionIndex,
        homeActionNodeKey
      ),
      control: {
        wheel,
        ok,
        home,
        pause,
        autoplay
      }
    }
    setActionNodes(okActionNodeKey, okTransitionActionNodeIndexInLI, okTransitionNumberOfOptions)
    setActionNodes(homeActionNodeKey, homeTransitionActionNodeIndexInLI, homeTransitionNumberOfOptions)
  }

  const
    firstStageNode = stages['s0'],
    nodes = {startAction: firstStageNode.ok, stages, actions},
    metadata = Object.assign(
      {title, uuid, image: 'title.png'},
      age !== undefined ? {age} : null
    )

  delete stages['s0']

  rmDirectory(dstPath)
  createPathDirectories(dstImagesPath)
  createPathDirectories(dstAudiosPath)
  fs.writeFileSync(path.join(dstPath, 'nodes.json'), JSON.stringify(nodes))
  fs.writeFileSync(path.join(dstPath, 'metadata.json'), JSON.stringify(metadata))

  const
    tmpPath = initTmpPath('story'),

    toSrcPathsArray = (arr, srcPath) => {
      return arr.map((v) => {
        const [dir, file] = v.split('\\')
        return path.join(srcPath, dir, file)
      })
    },
    toDstPathsArray = (arr, dstPath, renameFunction) => {
      return arr.map((v) => {
        return path.join(dstPath, renameFunction(v))
      })
    },
    tmpImagesPathsArray = toDstPathsArray(ri, tmpPath, renameToTmpImage),
    tmpMusicsPathsArray = toDstPathsArray(si, tmpPath, renameToTmpAudio)

  decipherMedias(
    toSrcPathsArray(ri, srcImagesPath),
    [...tmpImagesPathsArray],
    2,
    countFiles,
    (index) => convertStoryImages(
      tmpImagesPathsArray,
      toDstPathsArray(ri, dstImagesPath, renameImage),
      index,
      countFiles,
      (index) => decipherMedias(
        toSrcPathsArray(si, srcAudiosPath),
        [...tmpMusicsPathsArray],
        index,
        countFiles,
        (index) => convertAudios(
          tmpMusicsPathsArray,
          toDstPathsArray(si, dstAudiosPath, renameAudio),
          index,
          countFiles,
          () => {
            fs.copyFileSync(path.join(dstImagesPath, firstStageNode.image), path.join(dstPath, metadata.image))
            fs.copyFileSync(path.join(dstAudiosPath, firstStageNode.audio), path.join(dstPath, 'title.mp3'))
            process.stdout.write('success')
          },
          false
        )
      )
    )
  )
}

export default convertFolderFS
