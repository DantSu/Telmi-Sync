import path from 'path'
import fs from 'fs'
import {findAgeInStoryName, generateDirNameStory} from '../../Helpers/Stories.js'
import {createPathDirectories, recursiveCountFiles, rmDirectory} from '../../Helpers/Files.js'
import {convertCoverImage, convertStoryImages, findImage} from './Helpers/ImageFile.js'
import {convertAudios, findAudio} from './Helpers/AudioFile.js'
import {getStoriesPath, initTmpPath} from '../Helpers/AppPaths.js'
import {piperTTS} from '../BinFiles/PiperTTSCommand.js'
import {getTelmiSyncParams} from '../Helpers/TelmiSyncParams.js'


const
  getFileContent = (dir, fileName) => {
    const filePath = path.join(dir, fileName)
    if (!fs.existsSync(filePath)) {
      return null
    }
    return fs.readFileSync(filePath).toString('utf-8')
  },

  countOptions = (dir) => {
    let i = 0
    while (fs.existsSync(path.join(dir, i.toString()))) {
      ++i
    }
    return i
  },

  findNext = (nodes, home) => {
    if (home === null) {
      return null
    }
    const
      nbOptions = nodes.actions[home.action].length,
      nextIndex = home.index + 1
    if (nextIndex < nbOptions) {
      return {action: home.action, index: nextIndex}
    }
    return {action: 'a0', index: 0}
  },

  recursiveDirToNodes = (dir, nodes, home) => {
    const
      aKey = 'a' + Object.values(nodes.actions).length,
      nbOptions = countOptions(dir)

    if (nbOptions === 0) {
      const storyAudio = findAudio(dir, 'story')
      if (storyAudio !== null) {
        const sKey = 's' + Object.values(nodes.stages).length
        nodes.stages[sKey] = {
          image: null,
          audio: storyAudio,
          ok: findNext(nodes, home),
          home,
          control: {
            ok: false,
            home: true,
            autoplay: true
          }
        }
        nodes.actions[aKey] = [{stage: sKey}]
      }
    } else {
      const
        startIndex = Object.values(nodes.stages).length,
        stages = Array(nbOptions).fill(0).reduce(
          (acc, v, k) => {
            const
              sKey = 's' + (startIndex + k),
              pathSubDir = path.join(dir, k.toString()),
              optionImage = findImage(pathSubDir, 'title'),
              optionAudio = findAudio(pathSubDir, 'title')
            return {
              ...acc,
              [sKey]: {
                image: optionImage !== null ? optionImage : null,
                audio: optionAudio !== null ? optionAudio : null,
                ok: null,
                home,
                control: {
                  ok: true,
                  home: true,
                  autoplay: nbOptions === 1
                }
              }
            }
          },
          {}
        ),
        keysStages = Object.keys(stages)

      nodes.stages = {...nodes.stages, ...stages}
      nodes.actions[aKey] = keysStages.map((stage) => ({stage}))

      keysStages.forEach((sKey, index) => {
        nodes.stages[sKey].ok = {
          action: recursiveDirToNodes(
            path.join(dir, index.toString()),
            nodes,
            nbOptions === 1 ? home : {action: aKey, index}
          ),
          index: 0
        }
      })
    }
    return aKey
  },

  dirToNodes = (dir) => {
    const nodes = {startAction: null, stages: {}, actions: {}}
    nodes.startAction = {action: recursiveDirToNodes(dir, nodes, null), index: 0}
    return nodes
  },

  convertTextToSpeech = (srcAudio, index, length, callback) => {
    process.stdout.write('*converting-audio*' + index + '*' + length + '*')

    const srcTxt = srcAudio.filter((audio) => audio.endsWith('.txt'))
    if (!srcTxt.length) {
      return callback(srcAudio)
    }
    const
      txtToWav = srcTxt.reduce((acc, txt) => ({...acc, [txt]: txt.substring(0, txt.length - 4) + '.wav'}), {}),
      params = getTelmiSyncParams(),
      jsonPath = path.join(initTmpPath('json'), 'tts.json'),
      jsonContent = srcTxt.map((txt) => JSON.stringify({
        'text': fs.readFileSync(txt).toString('utf-8'),
        'output_file': txtToWav[txt]
      }))

    fs.writeFileSync(jsonPath, jsonContent.join('\n'))

    piperTTS(jsonPath, params.piper.voice, params.piper.speaker)
      .then(() => callback(srcAudio.map((audio) => txtToWav[audio] !== undefined ? txtToWav[audio] : audio)))
      .catch((e) => process.stderr.write(e.toString()))
  }

function convertFolderStoryPack(srcPath, storyName) {
  try {
    const countFiles = recursiveCountFiles(srcPath)
    process.stdout.write('*story-converting*1*' + countFiles + '*')
    const
      {age, title} = findAgeInStoryName(getFileContent(srcPath, 'title.txt') || storyName || path.basename(srcPath)),
      description = getFileContent(srcPath, 'description.txt'),
      category = getFileContent(srcPath, 'category.txt'),
      audioMainTitle = findAudio(srcPath, 'main-title'),
      imageMainTitle = findImage(srcPath, 'main-title'),
      imageCover = findImage(srcPath, 'cover'),

      metadata = Object.assign(
        {
          title,
          age,
          uuid: getFileContent(srcPath, 'uuid.txt') || 'fffffe-' + Date.now().toString(16),
          version: 0,
          image: imageCover != null ? 'cover.png' : 'title.png'
        },
        category !== null ? {category} : null,
        description !== null ? {description} : null
      ),

      dstPath = getStoriesPath(generateDirNameStory(metadata.title, metadata.uuid, metadata.age, metadata.category)),
      dstPathImages = path.join(dstPath, 'images'),
      dstPathAudio = path.join(dstPath, 'audios'),

      nodes = dirToNodes(srcPath),

      {srcImages, dstImages, srcAudio, dstAudio} = Object.keys(nodes.stages).reduce(
        (acc, stageKey) => {
          const stage = nodes.stages[stageKey]
          if (stage.audio !== null && fs.existsSync(stage.audio)) {
            acc.srcAudio = [...acc.srcAudio, stage.audio]
            acc.dstAudio = [...acc.dstAudio, path.join(dstPathAudio, stageKey + '.mp3')]
            stage.audio = stageKey + '.mp3'
          } else {
            stage.audio = null
          }
          if (stage.image !== null && fs.existsSync(stage.image)) {
            acc.srcImages = [...acc.srcImages, stage.image]
            acc.dstImages = [...acc.dstImages, path.join(dstPathImages, stageKey + '.png')]
            stage.image = stageKey + '.png'
          } else {
            stage.image = null
          }
          return acc
        },
        {
          srcImages: [imageMainTitle],
          dstImages: [path.join(dstPath, 'title.png')],
          srcAudio: [audioMainTitle],
          dstAudio: [path.join(dstPath, 'title.mp3')]
        }
      ),

      finishCallback = () => {
        fs.writeFileSync(path.join(dstPath, 'nodes.json'), JSON.stringify(nodes))
        fs.writeFileSync(path.join(dstPath, 'metadata.json'), JSON.stringify(metadata))
        process.stdout.write('success')
      }

    rmDirectory(dstPath)
    createPathDirectories(dstPathAudio)
    createPathDirectories(dstPathImages)

    convertStoryImages(
      srcImages,
      dstImages,
      null,
      null,
      2,
      countFiles,
      (index) => convertTextToSpeech(
        srcAudio,
        index,
        countFiles,
        (srcAudio) => convertAudios(
          srcAudio,
          dstAudio,
          index,
          countFiles,
          (index) => {
            if (imageCover !== null && fs.existsSync(imageCover)) {
              process.stdout.write('*converting-images*' + index + '*' + countFiles + '*')
              convertCoverImage(imageCover, path.join(dstPath, 'cover.png'))
                .then(finishCallback)
                .catch(() => process.stderr.write('file-not-found'))
            } else {
              finishCallback()
            }
          },
          false,
          false
        )
      )
    )
  } catch (e) {
    process.stderr.write(e.toString())
  }
}

export default convertFolderStoryPack