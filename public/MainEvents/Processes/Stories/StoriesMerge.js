import {getProcessParams} from '../Helpers/ProcessParams.js'
import fs from 'fs'
import path from 'path'
import {getTelmiSyncParams} from '../Helpers/TelmiSyncParams.js'
import {piperTTS} from '../BinFiles/PiperTTSCommand.js'
import {getStoriesPath, initTmpPath} from '../Helpers/AppPaths.js'
import {generateDirNameStory} from '../../Helpers/Stories.js'
import {createPathDirectories} from '../../Helpers/Files.js'
import {convertAudios} from '../Import/Helpers/AudioFile.js'
import {convertCoverImage, convertStoryImages} from '../Import/Helpers/ImageFile.js'

const
  getPrefixStage = (storyIndex) => 's' + storyIndex + '.',
  getPrefixAction = (storyIndex) => 'a' + storyIndex + '.',
  prefixActionsInStage = (action, storyIndex) => {
    if (action === null) {
      return {action: 'menu', index: storyIndex}
    }
    return {action: getPrefixAction(storyIndex) + action.action, index: action.index}
  },
  prefixStagesInAction = (stages, storyIndex) => {
    const prefixStage = getPrefixStage(storyIndex)
    return stages.map((stage) => ({stage: prefixStage + stage.stage}))
  },


  ttsTitle = (storyData, dstPath, index, countFiles, callback) => {
    process.stdout.write('*tts-converting*' + index + '*' + countFiles + '*')
    const
      tmpFolder = initTmpPath('stories-merge'),
      params = getTelmiSyncParams(),
      ttsJsonPath = path.join(tmpFolder, 'tts.json'),
      ttsTitlePath = path.join(tmpFolder, 'title.wav'),
      ttsQuestionPath = path.join(tmpFolder, 'question.wav')

    fs.writeFileSync(
      ttsJsonPath,
      [
        JSON.stringify({'text': storyData.title, 'output_file': ttsTitlePath}),
        JSON.stringify({'text': storyData.question, 'output_file': ttsQuestionPath})
      ].join('\n')
    )

    piperTTS(ttsJsonPath, params.piper.voice, params.piper.speaker)
      .then(() => callback(
        index + 1,
        [
          ttsTitlePath,
          ttsQuestionPath
        ],
        [
          path.join(dstPath, 'title.mp3'),
          path.join(dstPath, 'audios', 'question.mp3')
        ]
      ))
      .catch((e) => process.stderr.write(e.toString()))
  }


function main(jsonPath) {
  process.stdout.write('*initialize*0*1*')
  const
    storiesMerge = JSON.parse(fs.readFileSync(jsonPath, 'utf8')),
    metadata = Object.assign(
      {
        title: storiesMerge.title,
        age: storiesMerge.age || 0,
        uuid: 'fffffc-' + Date.now().toString(16),
        version: 0,
        image: 'cover.png'
      },
      storiesMerge.category !== '' ? {category: storiesMerge.category} : null
    ),
    dstPath = getStoriesPath(generateDirNameStory(metadata.title, metadata.uuid, metadata.age, metadata.category)),
    dstPathImages = path.join(dstPath, 'images'),
    dstPathAudio = path.join(dstPath, 'audios')

  createPathDirectories(dstPathAudio)
  createPathDirectories(dstPathImages)

  const newStoryData = storiesMerge.stories.reduce(
    (storiesAcc, story, storyIndex) => {
      process.stdout.write('*stories-analysis*' + (storyIndex + 1) + '*' + storiesMerge.stories.length + '*')

      const storyData = JSON.parse(fs.readFileSync(path.join(story.path, 'nodes.json'), 'utf8'))

      if (Array.isArray(storyData.inventory) && storyData.inventory.length > 0) {
        return storiesAcc
      }

      const prefixStage = getPrefixStage(storyIndex)

      storiesAcc.storiesImages.push({
        src: path.join(story.path, 'title.png'),
        dst: path.join(dstPathImages, 's' + storyIndex + '.png')
      })
      storiesAcc.files.push({
        src: path.join(story.path, 'title.mp3'),
        dst: path.join(dstPathAudio, 's' + storyIndex + '.mp3')
      })

      storiesAcc.nodes.stages = {
        ...storiesAcc.nodes.stages,
        ['s' + storyIndex]: {
          image: 's' + storyIndex + '.png',
          audio: 's' + storyIndex + '.mp3',
          ok: prefixActionsInStage(storyData.startAction, storyIndex),
          home: null,
          control: {ok: true, home: true, autoplay: false}
        },
        ...Object.keys(storyData.stages).reduce(
          (acc, kStage) => {
            const stageData = storyData.stages[kStage]
            if (stageData.image !== null) {
              storiesAcc.files.push({
                src: path.join(story.path, 'images', stageData.image),
                dst: path.join(dstPathImages, prefixStage + stageData.image)
              })
            }
            if (stageData.audio !== null) {
              storiesAcc.files.push({
                src: path.join(story.path, 'audios', stageData.audio),
                dst: path.join(dstPathAudio, prefixStage + stageData.audio)
              })
            }

            return {
              ...acc,
              [prefixStage + kStage]: {
                image: stageData.image === null ? null : prefixStage + stageData.image,
                audio: stageData.audio === null ? null : prefixStage + stageData.audio,
                ok: prefixActionsInStage(stageData.ok, storyIndex),
                home: prefixActionsInStage(stageData.home, storyIndex),
                control: {...stageData.control}
              }
            }
          },
          {}
        )
      }

      const prefixAction = getPrefixAction(storyIndex)

      storiesAcc.nodes.actions = {
        ...storiesAcc.nodes.actions,
        menu: [...storiesAcc.nodes.actions.menu, {stage: 's' + storyIndex}],
        ...Object.keys(storyData.actions).reduce(
          (acc, kAction) => ({
              ...acc,
              [prefixAction + kAction]: prefixStagesInAction(storyData.actions[kAction], storyIndex),
            }),
          {}
        )
      }
      return storiesAcc
    },
    {
      files: [],
      storiesImages: [{src: storiesMerge.image, dst: path.join(dstPath, 'title.png')}],
      nodes: {
        startAction: {action: 'startAction', index: 0},
        stages: {
          question: {
            image: null,
            audio: 'question.mp3',
            ok: {action: 'menu', index: 0},
            home: null,
            control: {ok: true, home: true, autoplay: true}
          }
        },
        actions: {
          menu: [],
          startAction: [{stage: 'question'}]
        }
      },
    }
  )

  if(newStoryData.storiesImages.length < 3) {
    process.stderr.write('stories-merge-error')
    return
  }

  fs.writeFileSync(path.join(dstPath, 'metadata.json'), JSON.stringify(metadata))
  fs.writeFileSync(path.join(dstPath, 'nodes.json'), JSON.stringify(newStoryData.nodes))

  let countFiles = newStoryData.files.length + newStoryData.storiesImages.length + 3
  convertCoverImage(
    storiesMerge.cover,
    path.join(dstPath, 'cover.png')
  )
    .then(() => convertStoryImages(
      newStoryData.storiesImages.map((img) => img.src),
      newStoryData.storiesImages.map((img) => img.dst),
      undefined,
      newStoryData.storiesImages.map((img, k) => k === 0 ? null : k + ' / ' + (newStoryData.storiesImages.length - 1)),
      1,
      countFiles,
      (index) => ttsTitle(
        storiesMerge,
        dstPath,
        index,
        countFiles,
        (index, srcAudios, dstAudios) => convertAudios(
          srcAudios,
          dstAudios,
          index,
          countFiles,
          (index) => {
            newStoryData.files.forEach(({src, dst}, k) => {
              process.stdout.write('*copy-files*' + (index + k) + '*' + countFiles + '*')
              fs.copyFileSync(src, dst)
            })
            process.stdout.write('success')
          },
          false,
          true
        )
      )
    ))
    .catch((e) => process.stderr.write(e.toString()))
}

const _params_ = getProcessParams()

if (_params_.length === 0) {
  process.stderr.write('no-file')
} else {
  main(_params_[0])
}

