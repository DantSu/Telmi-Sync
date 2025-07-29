import fs from 'fs'
import path from 'path'
import {getProcessParams} from '../Helpers/ProcessParams.js'
import {convertCoverImage, convertStoryImages} from '../Import/Helpers/ImageFile.js'
import {convertAudios} from '../Import/Helpers/AudioFile.js'
import {getTelmiSyncParams} from '../Helpers/TelmiSyncParams.js'
import {getStoriesPath, getTmpPath, initTmpPath} from '../Helpers/AppPaths.js'
import {piperTTS} from '../BinFiles/PiperTTSCommand.js'
import {generateDirNameStory} from '../../Helpers/Stories.js'
import {createPathDirectories, rmDirectory} from '../../Helpers/Files.js'
import {downloadFile} from '../../Helpers/Request.js'
import {stripHtmlTags} from '../../Helpers/Strings.js'

const
  tmpFolder = initTmpPath('store-builder'),

  convertTextToSpeech = (stringsTTS, index, length, callback) => {
    process.stdout.write('*tts-converting*' + (index++) + '*' + length + '*')
    const
      params = getTelmiSyncParams(),
      jsonPath = path.join(tmpFolder, 'tts.json'),
      txtToWav = stringsTTS.reduce((acc, txt, k) => ({...acc, [txt]: path.join(tmpFolder, k + '.wav')}), {}),
      jsonContent = stringsTTS.map((txt) => JSON.stringify({'text': txt, 'output_file': txtToWav[txt]}))

    fs.writeFileSync(jsonPath, jsonContent.join('\n'))

    piperTTS(jsonPath, params.piper.voice, params.piper.speaker)
      .then(() => callback(index, txtToWav))
      .catch((e) => process.stderr.write(e.toString()))
  },

  downloadImage = (srcImages, dstImages, errorDownload, index, countFiles, callback, i) => {
    if (i >= srcImages.length) {
      return callback(index, dstImages, errorDownload)
    }

    process.stdout.write('*downloading-files*' + (index++) + '*' + countFiles + '*')

    if (dstImages[srcImages[i].image] !== undefined) {
      return downloadImage(srcImages, dstImages, errorDownload, index, countFiles, callback, i + 1)
    }

    const tmpPath = getTmpPath()
    if (srcImages[i].image.substring(0, tmpPath.length) === tmpPath) {
      return downloadImage(srcImages, {
        ...dstImages,
        [srcImages[i].image]: srcImages[i].image
      }, errorDownload, index, countFiles, callback, i + 1)
    }

    const dstImage = path.join(tmpFolder, Date.now().toString(36))

    downloadFile(srcImages[i].image, dstImage, () => {})
      .then(() => downloadImage(
        srcImages,
        {...dstImages, [srcImages[i].image]: dstImage},
        errorDownload,
        index,
        countFiles,
        callback,
        i + 1
      ))
      .catch(() => downloadImage(
        srcImages,
        dstImages,
        [...errorDownload, srcImages[i]],
        index,
        countFiles,
        callback,
        i + 1
      ))
  },

  downloadImages = (srcImages, index, countFiles, callback) => {
    downloadImage(srcImages, {}, [], index, countFiles, callback, 0)
  },

  downloadAudio = (srcAudios, dstAudios, errorDownload, index, countFiles, callback, i) => {
    if (i >= srcAudios.length) {
      return callback(index, dstAudios, errorDownload)
    }

    process.stdout.write('*downloading-files*' + (index++) + '*' + countFiles + '*')

    if (dstAudios[srcAudios[i].download] !== undefined) {
      return downloadAudio(srcAudios, dstAudios, errorDownload, index, countFiles, callback, i + 1)
    }

    const dstAudio = path.join(tmpFolder, Date.now().toString(36))
    downloadFile(srcAudios[i].download, dstAudio, () => {})
      .then(() => downloadAudio(
        srcAudios,
        {...dstAudios, [srcAudios[i].download]: dstAudio},
        errorDownload,
        index,
        countFiles,
        callback,
        i + 1
      ))
      .catch(() => downloadAudio(
        srcAudios,
        dstAudios,
        [...errorDownload, srcAudios[i]],
        index,
        countFiles,
        callback,
        i + 1
      ))
  },

  downloadAudios = (srcAudios, index, countFiles, callback) => {
    downloadAudio(srcAudios, {}, [], index, countFiles, callback, 0)
  },

  audioListToFlatArray = (audioList) => audioList.audio.reduce(
    (acc, a) => {
      if (Array.isArray(a.audio)) {
        const child = audioListToFlatArray(a)
        return {
          audio: [...acc.audio, ...child.audio],
          categories: [...acc.categories, a]
        }
      }
      return {
        audio: [...acc.audio, a],
        categories: acc.categories
      }
    },
    {audio: [], categories: []}
  ),

  getFirstAudioOfAudioList = (audioList) => audioList.audio.reduce(
    (acc, a) => acc !== null ? acc : (Array.isArray(a.audio) ? getFirstAudioOfAudioList(a) : a),
    null
  ),

  filterAudioList = (audioList, arrayItemToFilter) => {
    const filteredAudioList = {
      ...audioList,
      audio: audioList.audio.reduce(
        (acc, a) => {
          if (arrayItemToFilter.includes(a)) {
            return acc
          }
          if (Array.isArray(a.audio)) {
            const nAL = filterAudioList(a, arrayItemToFilter)
            return nAL === null ? acc : [...acc, nAL]
          }
          return [...acc, a]
        },
        []
      )
    }

    const firstAudio = getFirstAudioOfAudioList(filteredAudioList)

    if (firstAudio === null) {
      return null
    }

    return {...filteredAudioList, image: firstAudio.image}
  },

  audioListToNodesAddFiles = (data, text, file) => {
    if (text === '') {
      return data
    }
    if (data[text] !== undefined) {
      return {...data, [text]: [...data[text], file]}
    }
    return {...data, [text]: [file]}
  },

  audioListToNodesFindHomeAction = (parentKey) => {
    const lastDot = parentKey.lastIndexOf('.')
    if (lastDot === -1) {
      return null
    }
    return {action: 'a' + parentKey.substring(0, lastDot), index: parseInt(parentKey.substring(lastDot + 1), 10)}
  },

  audioListToNodesFindNextAction = (key, parentLength) => {
    const lastDot = key.lastIndexOf('.')
    if (lastDot === -1) {
      return null
    }
    const index = parseInt(key.substring(lastDot + 1), 10) + 1
    if (index >= parentLength) {
      return audioListToNodesFindHomeAction(key.substring(0, lastDot))
    }
    return {action: 'a' + key.substring(0, lastDot), index}
  },

  audioListToNodes = (audioList, txtToAudio, imgToPath, audioToPath, parentKey) => {
    return audioList.audio.reduce(
      (acc, audio, k) => {
        const keyAudio = parentKey + '.' + k

        if (Array.isArray(audio.audio)) {
          const
            childNodes = audioListToNodes(audio, acc.txtToAudio, acc.imgToPath, acc.audioToPath, keyAudio),
            txtToAudio1 = audio.title === '' ? childNodes.txtToAudio : audioListToNodesAddFiles(
              childNodes.txtToAudio,
              audio.title,
              's' + keyAudio + '.mp3'
            ),
            txtToAudio2 = audio.question === '' ? txtToAudio1 : audioListToNodesAddFiles(
              txtToAudio1,
              audio.question,
              'q' + keyAudio + '.mp3'
            )
          return {
            stages: {
              ...acc.stages,
              ['s' + keyAudio]: {
                image: 's' + keyAudio + '.png',
                audio: audio.title !== '' ? 's' + keyAudio + '.mp3' : null,
                ok: {action: 'aq' + keyAudio, index: 0},
                home: audioListToNodesFindHomeAction(parentKey),
                control: {ok: true, home: true, autoplay: false}
              },
              ['q' + keyAudio]: {
                image: null,
                audio: audio.question !== '' ? 'q' + keyAudio + '.mp3' : null,
                ok: {action: 'a' + keyAudio, index: 0},
                home: {action: 'a' + parentKey, index: k},
                control: {ok: true, home: true, autoplay: true}
              },
              ...childNodes.stages,
            },
            actions: {
              ...acc.actions,
              ['aq' + keyAudio]: [{stage: 'q' + keyAudio}],
              ['a' + keyAudio]: audio.audio.map((a, k) => ({stage: 's' + keyAudio + '.' + k})),
              ...childNodes.actions,
            },
            notes: {
              ...acc.notes,
              ['s' + keyAudio]: {
                title: 's' + keyAudio,
                notes: audio.title,
              },
              ['q' + keyAudio]: {
                title: 'q' + keyAudio,
                notes: '',
              },
              ...childNodes.notes
            },
            txtToAudio: txtToAudio2,
            imgToPath: audioListToNodesAddFiles(
              childNodes.imgToPath,
              audio.image,
              {
                filename: 's' + keyAudio + '.png',
                number: (k + 1) + '/' + audioList.audio.length,
                title: audio.title || null
              }
            ),
            audioToPath: childNodes.audioToPath
          }
        }

        return {
          stages: {
            ...acc.stages,
            ['s' + keyAudio]: {
              image: 's' + keyAudio + '.png',
              audio: audio.title !== '' ? 's' + keyAudio + '.mp3' : null,
              ok: {action: 'a' + keyAudio, index: 0},
              home: audioListToNodesFindHomeAction(parentKey),
              control: {ok: true, home: true, autoplay: false}
            },
            ['ss' + keyAudio]: {
              image: null,
              audio: 'ss' + keyAudio + '.mp3',
              ok: audioListToNodesFindNextAction(keyAudio, audioList.audio.length),
              home: {action: 'a' + parentKey, index: k},
              control: {ok: false, home: true, autoplay: true}
            }
          },
          actions: {
            ...acc.actions,
            ['a' + keyAudio]: [{stage: 'ss' + keyAudio}]
          },
          notes: {
            ...acc.notes,
            ['s' + keyAudio]: {
              title: 's' + keyAudio,
              notes: audio.title,
            },
            ['ss' + keyAudio]: {
              title: audio.title,
              notes: stripHtmlTags(audio.description),
            }
          },
          txtToAudio: audio.title === '' ? acc.txtToAudio : audioListToNodesAddFiles(acc.txtToAudio, audio.title, 's' + keyAudio + '.mp3'),
          imgToPath: audioListToNodesAddFiles(
            acc.imgToPath,
            audio.image,
            {
              filename: 's' + keyAudio + '.png',
              number: (k + 1) + '/' + audioList.audio.length,
              title: audio.title || null
            }
          ),
          audioToPath: audioListToNodesAddFiles(acc.audioToPath, audio.download, 'ss' + keyAudio + '.mp3')
        }
      },
      {
        stages: {},
        actions: {},
        notes: {},
        txtToAudio,
        imgToPath,
        audioToPath
      }
    )
  }

function main(jsonPath) {
  try {
    process.stdout.write('*story-saving*0*100*')
    const
      audioList = JSON.parse(fs.readFileSync(jsonPath).toString('utf-8')),
      metadata = {
        title: audioList.title,
        uuid: 'fffffd-' + Date.now().toString(16),
        image: 'cover.png',
        category: audioList.category,
        description: audioList.description,
        version: 0,
        age: audioList.age,
      },
      dstPath = getStoriesPath(generateDirNameStory(metadata.title, metadata.uuid, metadata.age, metadata.category)),
      dstPathImages = path.join(dstPath, 'images'),
      dstPathAudio = path.join(dstPath, 'audios'),
      flatAudioList = audioListToFlatArray(audioList),
      imagesMain = [{image: audioList.cover}, {image: audioList.image}],
      countFiles = imagesMain.length * 3 + flatAudioList.audio.length * 5 + flatAudioList.categories.length * 4 + 2

    rmDirectory(dstPath)
    createPathDirectories(dstPathAudio)
    createPathDirectories(dstPathImages)

    downloadImages(
      imagesMain,
      0,
      countFiles,
      (index, srcLocalImageMain) => {
        downloadImages(
          flatAudioList.audio,
          index,
          countFiles,
          (index, srcLocalImage, errorDownloadImage) => {

            if (!Object.values(srcLocalImage).length) {
              return process.stderr.write('error-download-images')
            }

            const
              filteredAudioList = errorDownloadImage.length ? filterAudioList(audioList, errorDownloadImage) : audioList,
              flatAudioList = audioListToFlatArray(filteredAudioList),
              srcImagesMain = srcLocalImageMain.length === imagesMain.length ?
                srcLocalImageMain :
                imagesMain.map((v) => srcLocalImageMain[v.image] !== undefined ? srcLocalImageMain[v.image] : Object.values(srcLocalImage)[0])

            if (errorDownloadImage.length) {
              metadata.description += '\n\nDOWNLOAD IMAGE ERROR :\n' + errorDownloadImage.map((v) => v.title + ' : ' + v.image).join('\n')
            }

            downloadAudios(
              flatAudioList.audio,
              index,
              countFiles,
              (index, srcLocalAudio, errorDownloadAudio) => {

                if (!Object.values(srcLocalAudio).length) {
                  return process.stderr.write('error-download-audio')
                }

                if (errorDownloadAudio.length) {
                  metadata.description += '\n\nDOWNLOAD AUDIO ERROR :\n' + errorDownloadAudio.map((v) => v.title + ' : ' + v.download).join('\n')
                }

                const
                  audioList = errorDownloadAudio.length ? filterAudioList(filteredAudioList, errorDownloadAudio) : filteredAudioList,
                  audioListNodes = audioListToNodes(
                    audioList,
                    audioList.question === '' ? {} : {[audioList.question]: ['q0.mp3']},
                    {},
                    {},
                    '0'
                  ),

                  srcImages = Object.keys(audioListNodes.imgToPath).reduce(
                    (acc, srcImg) => {
                      const dst = audioListNodes.imgToPath[srcImg]
                      return {
                        srcPaths: [...acc.srcPaths, ...dst.map(() => srcLocalImage[srcImg])],
                        dstPaths: [...acc.dstPaths, ...dst.map((v) => path.join(dstPathImages, v.filename))],
                        titles: [...acc.titles, ...dst.map((v) => v.title)],
                        numbers: [...acc.numbers, ...dst.map((v) => v.number)]
                      }
                    },
                    {
                      srcPaths: [srcLocalImage[audioList.image]],
                      dstPaths: [path.join(dstPath, 'title.png')],
                      titles: [null],
                      numbers: [null]
                    }
                  ),

                  ttsTexts = Object.keys(audioListNodes.txtToAudio),

                  nodes = {
                    startAction: {action: 'start', index: 0},
                    stages: {
                      q0: {
                        image: null,
                        audio: audioList.question === '' ? null : 'q0.mp3',
                        ok: {action: 'a0', index: 0},
                        home: null,
                        control: {ok: true, home: true, autoplay: true}
                      },
                      ...audioListNodes.stages
                    },
                    actions: {
                      start: [{stage: 'q0'}],
                      a0: audioList.audio.map((a, k) => ({stage: 's0.' + k})),
                      ...audioListNodes.actions
                    }
                  },
                  notes = {
                    q0: {title: 'question', notes: ''},
                    ...audioListNodes.notes
                  }

                convertStoryImages(
                  [srcImagesMain[1], ...srcImages.srcPaths],
                  [path.join(dstPath, 'title.png'), ...srcImages.dstPaths],
                  audioList.titleImages ? [null, ...srcImages.titles] : null,
                  audioList.paginationImages ? [null, ...srcImages.numbers] : null,
                  index,
                  countFiles,
                  (index) => convertTextToSpeech(
                    [metadata.title, ...ttsTexts],
                    index,
                    countFiles,
                    (index, txtToWave) => {
                      const
                        ttsAudio = ttsTexts.reduce(
                          (acc, text) => ({
                            srcTts: [...acc.srcTts, ...audioListNodes.txtToAudio[text].map(() => txtToWave[text])],
                            dstTts: [...acc.dstTts, ...audioListNodes.txtToAudio[text].map((v) => path.join(dstPathAudio, v))]
                          }),
                          {srcTts: [txtToWave[metadata.title]], dstTts: [path.join(dstPath, 'title.mp3')]}
                        ),
                        storiesAudio = Object.keys(audioListNodes.audioToPath).reduce(
                          (acc, storyUrl) => ({
                            srcStories: [
                              ...acc.srcStories,
                              ...audioListNodes.audioToPath[storyUrl].map(() => srcLocalAudio[storyUrl])
                            ],
                            dstStories: [
                              ...acc.dstStories,
                              ...audioListNodes.audioToPath[storyUrl].map((v) => path.join(dstPathAudio, v))
                            ]
                          }),
                          {srcStories: [], dstStories: []}
                        ),
                        srcAudio = [...ttsAudio.srcTts, ...storiesAudio.srcStories],
                        dstAudio = [...ttsAudio.dstTts, ...storiesAudio.dstStories]

                      convertAudios(
                        srcAudio,
                        dstAudio,
                        index,
                        countFiles,
                        (index) => {
                          process.stdout.write('*converting-images*' + (index++) + '*' + countFiles + '*')
                          convertCoverImage(srcImagesMain[0], path.join(dstPath, 'cover.png'))
                            .then(() => {
                              process.stdout.write('*writing-metadata*' + index + '*' + countFiles + '*')
                              fs.writeFileSync(path.join(dstPath, 'nodes.json'), JSON.stringify(nodes))
                              fs.writeFileSync(path.join(dstPath, 'notes.json'), JSON.stringify(notes))
                              fs.writeFileSync(path.join(dstPath, 'metadata.json'), JSON.stringify(metadata))
                              process.stdout.write('success')
                            })
                            .catch(() => process.stderr.write('file-not-found'))
                        },
                        false,
                        false
                      )
                    }
                  )
                )
              }
            )
          }
        )
      }
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

