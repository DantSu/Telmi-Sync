import fs from 'fs'
import path from 'path'
import {getProcessParams} from '../Helpers/ProcessParams.js'
import {convertCoverImage, convertStoryImages} from '../Import/Helpers/ImageFile.js'
import {convertAudios} from '../Import/Helpers/AudioFile.js'
import {getTelmiSyncParams} from '../Helpers/TelmiSyncParams.js'
import {getStoriesPath, initTmpPath} from '../Helpers/AppPaths.js'
import {piperTTS} from '../BinFiles/PiperTTSCommand.js'
import {generateDirNameStory} from '../../Helpers/Stories.js'
import {createPathDirectories, rmDirectory} from '../../Helpers/Files.js'
import {downloadFile} from '../../Helpers/Request.js'

const
  tmpFolder = initTmpPath('store-builder'),

  convertTextToSpeech = (stringsTTS, index, length, callback) => {
    process.stdout.write('*tts-converting*' + (index++) + '*' + length + '*')
    const
      params = getTelmiSyncParams(),
      jsonPath = path.join(tmpFolder, 'tts.json'),
      txtToWav = stringsTTS.map((txt, k) => path.join(tmpFolder, k + '.wav')),
      jsonContent = stringsTTS.map((txt, k) => JSON.stringify({'text': txt, 'output_file': txtToWav[k]}))

    fs.writeFileSync(jsonPath, jsonContent.join('\n'))

    piperTTS(jsonPath, params.piper.voice, params.piper.speaker)
      .then(() => callback(index, txtToWav))
      .catch((e) => process.stderr.write(e.toString()))
  },

  downloadAudio = (srcAudios, dstAudios, index, countFiles, callback, i) => {
    process.stdout.write('*downloading-files*' + (index++) + '*' + countFiles + '*')
    if (i >= srcAudios.length) {
      return callback(index, dstAudios)
    }
    const dstAudio = path.join(tmpFolder, Date.now().toString(36))
    downloadFile(srcAudios[i], dstAudio, () => {})
      .then(() => downloadAudio(srcAudios, [...dstAudios, dstAudio], index, countFiles, callback, ++i))
      .catch(() => process.stderr.write('error-when-downloading : ' + srcAudios[i]))
  },

  downloadAudios = (srcAudios, index, countFiles, callback) => {
    downloadAudio(srcAudios, [], index, countFiles, callback, 0)
  }

function main(jsonPath) {
  try {
    process.stdout.write('*story-saving*0*100*')
    const
      {store, question, stories} = JSON.parse(fs.readFileSync(jsonPath).toString('utf-8')),
      metadata = {
        title: store.title,
        uuid: 'fffffd-' + Date.now().toString(16),
        image: 'cover.png',
        category: store.category,
        description: store.description,
        age: 0,
      },
      dstPath = getStoriesPath(generateDirNameStory(metadata.title, metadata.uuid, metadata.age, metadata.category)),
      dstPathImages = path.join(dstPath, 'images'),
      dstPathAudio = path.join(dstPath, 'audios'),
      srcTts = [store.title, question, ...stories.map((s) => s.title)],
      dstTts = [path.join(dstPath, 'title.mp3'), path.join(dstPathAudio, 'q.mp3'), ...stories.map((s, k) => path.join(dstPathAudio, 't' + k + '.mp3'))],
      srcHttpAudio = stories.map((s) => s.download),
      dstHttpAudio = stories.map((s, k) => path.join(dstPathAudio, 's' + k + '.mp3')),
      srcImages = [store.cover, ...stories.map((s) => s.image)],
      dstImages = [path.join(dstPath, 'title.png'), ...stories.map((s, k) => path.join(dstPathImages, k + '.png'))],
      countFiles = stories.length * 4 + 6,

      nodes = {
        startAction: {action: 'start', index: 0},
        stages: {
          question: {
            image: null,
            audio: 'q.mp3',
            ok: {action: 'dispatch', index: 0},
            home: null,
            control: {ok: true, home: true, autoplay: true}
          },
          ...stories.reduce(
            (acc, s, k) => ({
              ...acc,
              ['m' + k]: {
                image: k + '.png',
                audio: 't' + k + '.mp3',
                ok: {action: 'a' + k, index: 0},
                home: null,
                control: {ok: true, home: true, autoplay: false}
              },
              ['s' + k]: {
                image: null,
                audio: 's' + k + '.mp3',
                ok: {action: 'dispatch', index: (k + 1) < stories.length ? k + 1 : 0},
                home: {action: 'dispatch', index: k},
                control: {ok: false, home: true, autoplay: true}
              }
            }),
            {}
          )
        },
        actions: {
          start: [{stage: 'question'}],
          dispatch: stories.map((s, k) => ({stage: 'm' + k})),
          ...stories.reduce(
            (acc, s, k) => ({
              ...acc,
              ['a' + k]: [{stage: 's' + k}]
            }),
            {}
          )
        }
      }

    rmDirectory(dstPath)
    createPathDirectories(dstPathAudio)
    createPathDirectories(dstPathImages)

    convertStoryImages(
      srcImages,
      dstImages,
      0,
      countFiles,
      (index) => downloadAudios(
        srcHttpAudio,
        index,
        countFiles,
        (index, srcLocalAudio) => convertTextToSpeech(
          srcTts,
          index,
          countFiles,
          (index, tmpAudio) => {
            const
              srcAudio = [...tmpAudio, ...srcLocalAudio],
              dstAudio = [...dstTts, ...dstHttpAudio]
            convertAudios(
              srcAudio,
              dstAudio,
              index,
              countFiles,
              (index) => {
                process.stdout.write('*converting-images*' + (++index) + '*' + countFiles + '*')
                convertCoverImage(store.cover, path.join(dstPath, 'cover.png'))
                  .then(() => {
                    process.stdout.write('*writing-metadata*' + (++index) + '*' + countFiles + '*')
                    fs.writeFileSync(path.join(dstPath, 'nodes.json'), JSON.stringify(nodes))
                    fs.writeFileSync(path.join(dstPath, 'metadata.json'), JSON.stringify(metadata))
                    process.stdout.write('success')
                  })
                  .catch(() => process.stderr.write('file-not-found'))
              },
              false
            )
          }
        )
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

