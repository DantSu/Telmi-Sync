import {useCallback, useMemo} from 'react'
import {useLocale} from '../../../../../Components/Locale/LocaleHooks.js'
import {useStudioStory, useStudioStoryUpdater} from '../../Providers/StudioStoryHooks.js'
import InputText from '../../../../../Components/Form/Input/InputText.js'
import InputTextarea from '../../../../../Components/Form/Input/InputTextarea.js'
import InputAudio from '../../../../../Components/Form/Input/InputAudio.js'
import InputImage from '../../../../../Components/Form/Input/InputImage.js'
import StudioActionForm from './StudioActionForm.js'


function StudioStartStageForm() {
  const
    {getLocale} = useLocale(),
    {story: {metadata, nodes}, storyVersion} = useStudioStory(),
    {updateStory} = useStudioStoryUpdater(),

    startStageNode = useMemo(
      () => ({
        image: metadata.newImageTitle ||  metadata.imageTitle || null,
        audio: metadata.newAudioTitle || metadata.audioTitle || null,
        ok: nodes.startAction,
        home: null,
        control: {
          ok: true,
          home: true,
          autoplay: false
        }
      }),
      [metadata, nodes]
    ),

    onTitleBlur = useCallback(
      (e) => updateStory((s) => {
        if(s.metadata.title === e.target.value) {
          return s
        }
        s.metadata.title = e.target.value
        return {...s}
      }),
      [updateStory]
    ),
    onCategoryBlur = useCallback(
      (e) => updateStory((s) => {
        if(s.metadata.category === e.target.value) {
          return s
        }
        s.metadata.category = e.target.value
        return {...s}
      }),
      [updateStory]
    ),
    onAgeBlur = useCallback(
      (e) => updateStory((s) => {
        if(s.metadata.age === e.target.value) {
          return s
        }
        s.metadata.age = e.target.value
        return {...s}
      }),
      [updateStory]
    ),
    onDescriptionBlur = useCallback(
      (e) => updateStory((s) => {
        if(s.metadata.description === e.target.value) {
          return s
        }
        s.metadata.description = e.target.value
        return {...s}
      }),
      [updateStory]
    ),
    onImageTitleChange = useCallback(
      (path) => updateStory((s) => {
        s.metadata.newImageTitle = path
        return {...s}
      }),
      [updateStory]
    ),
    onImageCoverChange = useCallback(
      (path) => updateStory((s) => {
        s.metadata.newImageCover = path
        return {...s}
      }),
      [updateStory]
    ),
    onAudioChange = useCallback(
      (path) => updateStory((s) => {
        s.metadata.newAudioTitle = path
        return {...s}
      }),
      [updateStory]
    )

  return <>
    <InputText label={getLocale('title')}
               key={'startStage-title-' + storyVersion + '-' + metadata.title}
               id={'startStage-title'}
               defaultValue={metadata.title}
               onBlur={onTitleBlur}/>
    <InputText label={getLocale('category')}
               key={'startStage-category-' + storyVersion}
               id={'startStage-category'}
               defaultValue={metadata.category}
               onBlur={onCategoryBlur}/>
    <InputText label={getLocale('age')}
               key={'startStage-age-' + storyVersion}
               id={'startStage-age'}
               type="number"
               step={1}
               min={0}
               max={99}
               defaultValue={metadata.age}
               onBlur={onAgeBlur}/>
    <InputTextarea label={getLocale('description')}
                   key={'startStage-text-' + storyVersion}
                   id={'startStage-text'}
                   defaultValue={metadata.description}
                   onBlur={onDescriptionBlur}
                   vertical={true}/>
    <InputAudio label={getLocale('audio-title')}
                key={'startStage-audio-' + storyVersion}
                id={'startStage-audio'}
                textTTS={metadata.title}
                onChange={onAudioChange}
                audio={metadata.newAudioTitle ? metadata.newAudioTitle : metadata.audioTitle}/>
    <InputImage label={getLocale('picture-cover')}
                width={512}
                height={512}
                displayScale={0.4}
                vertical={true}
                key={'startStage-img-cover-' + storyVersion}
                id={'startStage-img-cover'}
                onChange={onImageCoverChange}
                defaultValue={metadata.newImageCover ? metadata.newImageCover : metadata.imageCover}/>
    <InputImage label={getLocale('picture-title')}
                width={640}
                height={480}
                displayScale={0.4}
                vertical={true}
                key={'startStage-img-title-' + storyVersion}
                id={'startStage-img-title'}
                onChange={onImageTitleChange}
                defaultValue={metadata.newImageTitle ? metadata.newImageTitle : metadata.imageTitle}/>

    <StudioActionForm stageNode={startStageNode}/>
  </>
}

  export default StudioStartStageForm