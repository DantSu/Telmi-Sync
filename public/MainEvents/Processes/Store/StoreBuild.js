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
import {stripHtmlTags} from '../../Helpers/Strings.js'

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

  downloadImage = (srcImages, dstImages, errorDownload, index, countFiles, callback, i) => {
    if (i >= srcImages.length) {
      return callback(index, dstImages, errorDownload)
    }
    process.stdout.write('*downloading-files*' + (index++) + '*' + countFiles + '*')
    const dstImage = path.join(tmpFolder, Date.now().toString(36))
    downloadFile(srcImages[i], dstImage, () => {})
      .then(() => downloadImage(srcImages, [...dstImages, dstImage], errorDownload, index, countFiles, callback, i + 1))
      .catch(() => downloadImage(srcImages, dstImages, [...errorDownload, i], index, countFiles, callback, i + 1))
  },

  downloadImages = (srcImages, index, countFiles, callback) => {
    downloadImage(srcImages, [], [], index, countFiles, callback, 0)
  },

  downloadAudio = (srcAudios, dstAudios, errorDownload, index, countFiles, callback, i) => {
    if (i >= srcAudios.length) {
      return callback(index, dstAudios, errorDownload)
    }
    process.stdout.write('*downloading-files*' + (index++) + '*' + countFiles + '*')
    const dstAudio = path.join(tmpFolder, Date.now().toString(36))
    downloadFile(srcAudios[i], dstAudio, () => {})
      .then(() => downloadAudio(srcAudios, [...dstAudios, dstAudio], errorDownload, index, countFiles, callback, i + 1))
      .catch(() => downloadAudio(srcAudios, dstAudios, [...errorDownload, i], index, countFiles, callback, i + 1))
  },

  downloadAudios = (srcAudios, index, countFiles, callback) => {
    downloadAudio(srcAudios, [], [], index, countFiles, callback, 0)
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
        description: stripHtmlTags(audioList.description),
        version: 0,
        age: audioList.age,
      },
      dstPath = getStoriesPath(generateDirNameStory(metadata.title, metadata.uuid, metadata.age, metadata.category)),
      dstPathImages = path.join(dstPath, 'images'),
      dstPathAudio = path.join(dstPath, 'audios'),
      rawSrcImages = [audioList.cover, audioList.image, ...stories.map((s) => s.image)],
      countFiles = stories.length * 5 + 6

    rmDirectory(dstPath)
    createPathDirectories(dstPathAudio)
    createPathDirectories(dstPathImages)

    downloadImages(
      rawSrcImages,
      0,
      countFiles,
      (index, rawSrcImages, errorDownloadImage) => {

        if (!rawSrcImages.length) {
          return process.stderr.write('error-download-images')
        }

        const
          rawSrcImages2 = errorDownloadImage[0] === 0 ? [rawSrcImages[0], ...rawSrcImages] : rawSrcImages,
          errorDownloadImage2 = errorDownloadImage.reduce((acc, v) => v > 0 ? [...acc, v - 1] : acc, []),
          filteredStories = errorDownloadImage2.length ? stories.filter((s, k) => !errorDownloadImage2.includes(k)) : stories,
          srcHttpAudio = filteredStories.map((s) => s.download),
          coverTmpImage = rawSrcImages2[0]

        if (errorDownloadImage2.length) {
          metadata.description += '\n\nDOWNLOAD IMAGE ERROR :\n' + errorDownloadImage2.map((index) => stories[index].title + ' : ' + stories[index].image).join('\n')
        }

        downloadAudios(
          srcHttpAudio,
          index,
          countFiles,
          (index, srcLocalAudio, errorDownloadAudio) => {

            if (!srcLocalAudio.length) {
              return process.stderr.write('error-download-audio')
            }

            if (errorDownloadAudio.length) {
              metadata.description += '\n\nDOWNLOAD AUDIO ERROR :\n' + errorDownloadAudio.map((index) => filteredStories[index].title + ' : ' + filteredStories[index].download).join('\n')
            }

            const
              stories = errorDownloadAudio.length ? filteredStories.filter((s, k) => !errorDownloadAudio.includes(k)) : filteredStories,
              storiesTitles = stories.map((s) => s.title),
              srcTts = [store.title, question, ...storiesTitles],
              dstTts = [path.join(dstPath, 'title.mp3'), path.join(dstPathAudio, 'q.mp3'), ...stories.map((s, k) => path.join(dstPathAudio, 't' + k + '.mp3'))],
              dstHttpAudio = stories.map((s, k) => path.join(dstPathAudio, 's' + k + '.mp3')),
              titleImages = store.titleImages ? [undefined, ...storiesTitles] : null,
              pagesNumberingImages = [undefined, ...storiesTitles.map((v, k) => (k + 1) + '/' + storiesTitles.length)],
              srcImages = errorDownloadAudio.length ? rawSrcImages2.filter((s, k) => !errorDownloadAudio.includes(k - 1)) : rawSrcImages2,
              dstImages = [path.join(dstPath, 'title.png'), ...stories.map((s, k) => path.join(dstPathImages, k + '.png'))],

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
              },
              notes = {
                question: {title: 'question', notes: ''},
                ...stories.reduce(
                  (acc, s, k) => ({
                    ...acc,
                    ['m' + k]: {
                      title: 'm' + k,
                      notes: s.title,
                    },
                    ['s' + k]: {
                      title: s.title,
                      notes: stripHtmlTags(s.description),
                    }
                  }),
                  {}
                )
              }

            convertStoryImages(
              srcImages,
              dstImages,
              titleImages,
              pagesNumberingImages,
              index,
              countFiles,
              (index) => convertTextToSpeech(
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
                      process.stdout.write('*converting-images*' + (index++) + '*' + countFiles + '*')
                      convertCoverImage(coverTmpImage, path.join(dstPath, 'cover.png'))
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

