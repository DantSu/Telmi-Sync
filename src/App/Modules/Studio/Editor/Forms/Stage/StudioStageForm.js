import {useCallback, useRef} from 'react'
import {useLocale} from '../../../../../Components/Locale/LocaleHooks.js'
import {useStudioForm} from '../../Providers/StudioStageHooks.js'
import {useStudioStory, useStudioStoryUpdater} from '../../Providers/StudioStoryHooks.js'

import InputText from '../../../../../Components/Form/Input/InputText.js'
import InputTextarea from '../../../../../Components/Form/Input/InputTextarea.js'
import InputImage from '../../../../../Components/Form/Input/InputImage.js'
import InputAudio from '../../../../../Components/Form/Input/InputAudio.js'
import InputSwitch from '../../../../../Components/Form/Input/InputSwitch.js'
import StudioActionForm from './StudioActionForm.js'
import StudioStageInventoryForm from './StudioStageInventoryForm.js'

import styles from './StudioStageForm.module.scss'

const colors = [
  'pink', 'pink2', 'purple3', 'purple4', 'purple5', 'yellow', 'orange2', 'orange3', 'red', 'red2',
  'brown', 'green', 'green2', 'green3', 'green4', 'blue', 'blue2', 'blue3', 'blue4'
]

function StudioStageForm() {
  const
    {getLocale} = useLocale(),
    {form: stage} = useStudioForm(),
    {story: {metadata, nodes, notes}, storyVersion} = useStudioStory(),
    {updateStory} = useStudioStoryUpdater(),
    note = notes[stage],
    stageNode = nodes.stages[stage],

    onColorClicked = useCallback(
      (color) => updateStory((s) => {
        if (s.notes[stage].color === color) {
          return s
        }
        s.notes[stage].color = color
        return {...s}
      }),
      [stage, updateStory]
    ),
    onTitleBlur = useCallback(
      (e) => updateStory((s) => {
        if (s.notes[stage].title === e.target.value) {
          return s
        }
        s.notes[stage].title = e.target.value
        return {...s}
      }),
      [stage, updateStory]
    ),
    onNotesBlur = useCallback(
      (e) => updateStory((s) => {
        if (s.notes[stage].notes === e.target.value) {
          return s
        }
        s.notes[stage].notes = e.target.value
        return {...s}
      }),
      [stage, updateStory]
    ),
    onImageChange = useCallback(
      (path) => updateStory((s) => {
        s.nodes.stages[stage].newImage = path
        return {...s}
      }),
      [stage, updateStory]
    ),
    onImageDelete = useCallback(
      () => updateStory((s) => {
        s.nodes.stages[stage].image = null
        delete s.nodes.stages[stage].newImage
        return {...s}
      }),
      [stage, updateStory]
    ),
    onAudioChange = useCallback(
      (path) => updateStory((s) => {
        s.nodes.stages[stage].newAudio = path
        return {...s}
      }),
      [stage, updateStory]
    ),
    onAudioDelete = useCallback(
      () => updateStory((s) => {
        s.nodes.stages[stage].audio = null
        delete s.nodes.stages[stage].newAudio
        return {...s}
      }),
      [stage, updateStory]
    ),
    refOk = useRef(null),
    refAutoplay = useRef(null),
    onControlOkChange = useCallback(
      (e) => updateStory((s) => {
        s.nodes.stages[stage].control.ok = e.target.checked
        if (!e.target.checked) {
          s.nodes.stages[stage].control.autoplay = true
          refAutoplay.current.checked = true
        }
        return {...s}
      }),
      [stage, updateStory]
    ),
    onControlAutoplayChange = useCallback(
      (e) => updateStory((s) => {
        s.nodes.stages[stage].control.autoplay = e.target.checked
        if (!e.target.checked) {
          s.nodes.stages[stage].control.ok = true
          refOk.current.checked = true
        }
        return {...s}
      }),
      [stage, updateStory]
    )

  return <>
    <ul className={styles.colorsPicker}>{
      colors.map((c) => <li key={'color-'  + c}
                            onClick={() => onColorClicked(c)}
                            className={[
                              note.color === c ? styles.colorPicked : styles.colorPicker,
                              styles[c]
                            ].join(' ')}></li>)
    }</ul>
    <InputText label={getLocale('title')}
               id={'title'}
               key={'title-' + storyVersion + '-' + stage}
               defaultValue={note.title}
               onBlur={onTitleBlur}/>
    <InputTextarea label={getLocale('text')}
                   key={'text-' + storyVersion + '-' + stage}
                   id={'text'}
                   defaultValue={note.notes}
                   onBlur={onNotesBlur}
                   vertical={true}/>
    <InputAudio label={getLocale('story')}
                key={'audio-' + storyVersion + '-' + stage}
                id={'audio'}
                textTTS={note.notes}
                onChange={onAudioChange}
                onDelete={onAudioDelete}
                audio={stageNode.newAudio ? stageNode.newAudio : (stageNode.audio ? metadata.path + '/audios/' + stageNode.audio : undefined)}/>
    <InputSwitch label={getLocale('studio-stage-control-ok')}
                 key={'control-ok-' + storyVersion + '-' + stage}
                 id={'control-ok'}
                 defaultValue={stageNode.control.ok}
                 ref={refOk}
                 onChange={onControlOkChange}/>
    <InputSwitch label={getLocale('studio-stage-autoplay')}
                 key={'control-autoplay-' + storyVersion + '-' + stage}
                 id={'control-autoplay'}
                 ref={refAutoplay}
                 defaultValue={stageNode.control.autoplay}
                 onChange={onControlAutoplayChange}/>
    <InputImage label={getLocale('picture')}
                width={640}
                height={480}
                displayScale={0.4}
                vertical={true}
                key={'image-' + storyVersion + '-' + stage}
                id={'image'}
                onChange={onImageChange}
                onDelete={onImageDelete}
                defaultValue={stageNode.newImage ? stageNode.newImage : (stageNode.image ? metadata.path + '/images/' + stageNode.image : undefined)}/>

    {Array.isArray(nodes.inventory) && <StudioStageInventoryForm/>}
    <StudioActionForm stageNode={stageNode}/>
  </>
}

export default StudioStageForm