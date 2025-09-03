import fs from 'fs'
import path from 'path'
import {findAgeInStoryName, generateDirNameStory} from '../../Helpers/Stories.js'
import {convertAudios, isAudioFile} from './Helpers/AudioFile.js'
import {convertCoverImage, convertStoryImages, findImage} from './Helpers/ImageFile.js'
import {getStoriesPath, initTmpPath} from '../Helpers/AppPaths.js'
import {piperTTS} from '../BinFiles/PiperTTSCommand.js'
import {getTelmiSyncParams} from '../Helpers/TelmiSyncParams.js'
import {createPathDirectories, rmDirectory} from '../../Helpers/Files.js'


function convertFolderAudioList(srcPath, storyName) {
  try {
    process.stdout.write('*initialize*0*1*')

    const
      listAudio = fs
        .readdirSync(srcPath, {encoding: 'utf8'})
        .reduce((acc, f) => isAudioFile(f) ? [...acc, f] : acc, []),
      imageFile = findImage(srcPath, 'stories-image'),
      countFiles = listAudio.length * 3 + 5

    if (imageFile === null || listAudio.length < 1) {
      process.stderr.write('story-format-invalid')
      return
    }

    process.stdout.write('*story-converting*0*' + countFiles + '*')

    const
      {age, title} = findAgeInStoryName(storyName || path.basename(srcPath)),
      pathQuestion = path.join(srcPath, 'question.txt'),
      pathCategory = path.join(srcPath, 'category.txt'),
      pathDescription = path.join(srcPath, 'description.txt'),
      question = fs.existsSync(pathQuestion) ? fs.readFileSync(pathQuestion).toString('utf-8') : null,
      metadata = Object.assign(
        {title, age, uuid: 'fffffb-' + Date.now().toString(16), version: 0, image: 'cover.png'},
        fs.existsSync(pathCategory) ? {category: fs.readFileSync(pathCategory).toString('utf-8')} : null,
        fs.existsSync(pathDescription) ? {category: fs.readFileSync(pathDescription).toString('utf-8')} : null
      ),
      nodes = {
        startAction: {action: 'q', index: 0},
        stages: {
          q: {
            image: null,
            audio: question !== null ? 'q.mp3' : null,
            ok: {action: 'm', index: 0},
            home: null,
            control: {
              ok: true,
              home: true,
              autoplay: true
            }
          },
          ...listAudio.reduce(
            (acc, f, k) => ({
              ...acc,
              ['m' + k]: {
                image: 'm' + k + '.png',
                audio: 'm' + k + '.mp3',
                ok: {action: 's' + k, index: 0},
                home: null,
                control: {
                  ok: true,
                  home: true,
                  autoplay: false
                }
              },
              ['s' + k]: {
                image: null,
                audio: 's' + k + '.mp3',
                ok: {action: 'm', index: (k + 1) >= listAudio.length ? 0 : (k + 1)},
                home: {action: 'm', index: k},
                control: {
                  ok: false,
                  home: true,
                  autoplay: true
                }
              }
            }),
            {}
          )
        },
        actions: {
          q: [{stage: 'q'}],
          m: listAudio.map((f, k) => ({stage: 'm' + k})),
          ...listAudio.reduce((acc, f, k) => ({...acc, ['s' + k]: [{stage: 's' + k}]}), {})
        }
      },

      dstPath = getStoriesPath(generateDirNameStory(metadata.title, metadata.uuid, metadata.age, metadata.category)),
      dstPathImages = path.join(dstPath, 'images'),
      dstPathAudio = path.join(dstPath, 'audios'),
      params = getTelmiSyncParams(),

      srcImages = [imageFile, ...listAudio.map(() => imageFile)],
      dstImages = [
        path.join(dstPath, 'title.png'),
        ...listAudio.map((f, k) => path.join(dstPathImages, 'm' + k + '.png'))
      ],
      ttsTmpPath = initTmpPath('pipertts'),
      ttsJsonPath = path.join(ttsTmpPath, 'tts.json'),
      storiesTxt = listAudio.map((f) => path.parse(f).name),
      ttsTxt = [
        title,
        ...(question !== null ? [question] : []),
        ...storiesTxt
      ],
      ttsFiles = [
        path.join(ttsTmpPath, 'title.wav'),
        ...(question !== null ? [path.join(ttsTmpPath, 'q.wav')] : []),
        ...storiesTxt.map((f, k) => path.join(ttsTmpPath, 'm' + k + '.wav'))
      ],
      dstTtsFiles = [
        path.join(dstPath, 'title.mp3'),
        ...(question !== null ? [path.join(dstPathAudio, 'q.mp3')] : []),
        ...storiesTxt.map((f, k) => path.join(dstPathAudio, 'm' + k + '.mp3'))
      ],
      txtToWrite = [null, ...storiesTxt],
      pageNumbering = [null, ...listAudio.map((f, k) => (k + 1) + '/' + listAudio.length)],
      srcAudio = [...ttsFiles, ...listAudio.map((f) => path.join(srcPath, f))],
      dstAudio = [...dstTtsFiles, ...listAudio.map((f, k) => path.join(dstPathAudio, 's' + k + '.mp3'))]

    fs.writeFileSync(
      ttsJsonPath,
      ttsTxt.map((txt, k) => JSON.stringify({'text': txt, 'output_file': ttsFiles[k]})).join('\n')
    )
    rmDirectory(dstPath)
    createPathDirectories(dstPathAudio)
    createPathDirectories(dstPathImages)

    convertStoryImages(
      srcImages,
      dstImages,
      txtToWrite,
      pageNumbering,
      1,
      countFiles,
      (index) => piperTTS(ttsJsonPath, params.piper.voice, params.piper.speaker)
        .then(
          () => convertAudios(
            srcAudio,
            dstAudio,
            index,
            countFiles,
            (index) => {
              process.stdout.write('*converting-images*' + index + '*' + countFiles + '*')
              process.stdout.write('*' + imageFile + '*' + index + '*' + countFiles + '*')
              convertCoverImage(imageFile, path.join(dstPath, 'cover.png'))
                .then(() => {
                  process.stdout.write('*story-converting*' + (index + 1) + '*' + countFiles + '*')
                  fs.writeFileSync(path.join(dstPath, 'nodes.json'), JSON.stringify(nodes))
                  fs.writeFileSync(path.join(dstPath, 'metadata.json'), JSON.stringify(metadata))
                  process.stdout.write('success')
                })
                .catch((e) => process.stderr.write(e.toString()))
            },
            false,
            false
          )
        )
        .catch((e) => process.stderr.write(e.toString()))
    )
  } catch (e) {
    process.stderr.write(e.toString())
  }
}

export default convertFolderAudioList