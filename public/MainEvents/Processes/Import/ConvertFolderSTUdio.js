import * as fs from 'fs'
import * as path from 'path'
import { createPathDirectories, isDirectory, recursiveCountFiles, rmDirectory } from '../../Helpers/Files.js'
import { getStoriesPath } from '../Helpers/AppPaths.js'
import { convertStoryImages, isImageFile } from './Helpers/ImageFile.js'
import { convertAudios, isAudioFile } from './Helpers/AudioFile.js'
import { stringSlugify } from '../../Helpers/Strings.js'

function convertFolderSTUdio (srcPath, storyName) {
  try {
    const countFiles = recursiveCountFiles(srcPath)
    process.stdout.write('*story-converting*1*' + countFiles + '*')

    const
      findNewName = (currentName, prefix, suffix, objectNames) => {
        if (currentName === null) {
          return null
        }
        if (objectNames[currentName] === undefined) {
          objectNames[currentName] = prefix + Object.values(objectNames).length + suffix
        }
        return objectNames[currentName]
      },
      imagesNewNames = {},
      audiosNewNames = {},
      stagesNewNames = {},
      actionsNewNames = {},

      renameImage = (name) => findNewName(name, '', '.png', imagesNewNames),
      renameAudio = (name) => findNewName(name, '', '.mp3', audiosNewNames),
      renameStage = (name) => findNewName(name, 's', '', stagesNewNames),
      renameAction = (name) => findNewName(name, 'a', '', actionsNewNames),

      reformatTransition = (transition) => {
        if (transition === null) {
          return null
        }
        return {
          action: renameAction(transition.actionNode),
          index: transition.optionIndex
        }
      },

      srcAssetsPath = path.join(srcPath, 'assets'),
      srcPathThumbnail = path.join(srcPath, 'thumbnail.png'),
      studioData = JSON.parse(fs.readFileSync(path.join(srcPath, 'story.json'), 'utf8')),

      stageNodes = [...studioData.stageNodes],
      firstStageNode = stageNodes.shift(),

      title = typeof studioData.title === 'string' ? studioData.title : (storyName || path.basename(srcPath)),

      dstPath = getStoriesPath(stringSlugify(firstStageNode.uuid)),
      dstImagesPath = path.join(dstPath, 'images'),
      dstAudiosPath = path.join(dstPath, 'audios'),

      nodes = {
        startAction: reformatTransition(firstStageNode.okTransition),
        stages: stageNodes.reduce(
          (acc, node) => ({
            ...acc,
            [renameStage(node.uuid)]: {
              image: renameImage(node.image),
              audio: renameAudio(node.audio),
              ok: reformatTransition(node.okTransition),
              home: reformatTransition(node.homeTransition),
              control: node.controlSettings,
            }
          }),
          {}
        ),
        actions: studioData.actionNodes.reduce(
          (acc, node) => ({
            ...acc,
            [renameAction(node.id)]: node.options.map((v) => ({stage: renameStage(v)}))
          }),
          {}
        )
      },
      metadata = {
        title,
        uuid: firstStageNode.uuid,
        image: 'title.png'
      }

    rmDirectory(dstPath)

    createPathDirectories(dstImagesPath)
    createPathDirectories(dstAudiosPath)

    fs.writeFileSync(path.join(dstPath, 'nodes.json'), JSON.stringify(nodes))

    const
      [srcAudios, srcImages] = fs.readdirSync(srcAssetsPath)
        .reduce(
          (acc, f) => {
            const fp = path.join(srcAssetsPath, f)
            if (isDirectory(fp)) {
              return acc
            } else if (isAudioFile(f)) {
              return [[...acc[0], fp], acc[1]]
            } else if (isImageFile(f)) {
              return [acc[0], [...acc[1], fp]]
            } else {
              return acc
            }
          },
          [[], []]
        ),
      toDstPathsArray = (arr, dstPath, renameFunction) => {
        return arr.map((v) => path.join(dstPath, renameFunction(path.basename(v))))
      }

    convertStoryImages(
      srcImages,
      toDstPathsArray(srcImages, dstImagesPath, renameImage),
      2,
      countFiles,
      (index) => convertAudios(
        srcAudios,
        toDstPathsArray(srcAudios, dstAudiosPath, renameAudio),
        index,
        countFiles,
        () => {
          const
            imageFileName = renameImage(firstStageNode.image),
            audioFileName = renameAudio(firstStageNode.audio)
          fs.copyFileSync(path.join(dstImagesPath, imageFileName), path.join(dstPath, metadata.image))
          fs.copyFileSync(path.join(dstAudiosPath, audioFileName), path.join(dstPath, 'title.mp3'))
          if (fs.existsSync(srcPathThumbnail)) {
            metadata.image = 'cover.png'
            fs.copyFileSync(srcPathThumbnail, path.join(dstPath, metadata.image))
          }
          fs.writeFileSync(path.join(dstPath, 'metadata.json'), JSON.stringify(metadata))
          process.stdout.write('success')
        },
        false
      )
    )
  } catch (e) {
    process.stderr.write(e.toString())
    process.stderr.write('story-studio-format-invalid')
  }
}

export default convertFolderSTUdio
