import {useCallback, useRef} from 'react'
import {useLocale} from '../../../../Components/Locale/LocaleHooks.js'
import {useStudioForm} from '../Providers/StudioStageHooks.js'
import {useStudioStory, useStudioStoryUpdater} from '../Providers/StudioStoryHooks.js'

import InputText from '../../../../Components/Form/Input/InputText.js'
import InputTextarea from '../../../../Components/Form/Input/InputTextarea.js'
import InputImage from '../../../../Components/Form/Input/InputImage.js'
import InputAudio from '../../../../Components/Form/Input/InputAudio.js'
import StudioActionForm from './StudioActionForm.js'
import InputSwitch from '../../../../Components/Form/Input/InputSwitch.js'

function StudioStageForm() {
  const
    {getLocale} = useLocale(),
    {form: stage} = useStudioForm(),
    {metadata, nodes, notes} = useStudioStory(),
    {updateStory} = useStudioStoryUpdater(),
    note = notes[stage],
    stageNode = nodes.stages[stage],

    onTitleBlur = useCallback(
      (e) => updateStory((s) => {
        s.notes[stage].title = e.target.value
        return {...s}
      }),
      [stage, updateStory]
    ),
    onNotesBlur = useCallback(
      (e) => updateStory((s) => {
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
    onAudioChange = useCallback(
      (path) => updateStory((s) => {
        s.nodes.stages[stage].newAudio = path
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
    <InputText label={getLocale('title')}
               id={stage + '-title'}
               key={stage + '-title'}
               defaultValue={note.title}
               onBlur={onTitleBlur}/>
    <InputTextarea label={getLocale('text')}
                   key={stage + '-text'}
                   id={stage + '-text'}
                   defaultValue={note.notes}
                   onBlur={onNotesBlur}
                   vertical={true}/>
    <InputAudio label={getLocale('story')}
                key={stage + '-audio'}
                id={stage + '-audio'}
                textTTS={notes[stage].notes}
                onChange={onAudioChange}
                audio={stageNode.newAudio ? stageNode.newAudio : (stageNode.audio ? metadata.path + '/audios/' + stageNode.audio : undefined)}/>
    <InputSwitch label={getLocale('studio-stage-control-ok')}
                 key={stage + '-control-ok'}
                 id={stage + '-control-ok'}
                 defaultValue={stageNode.control.ok}
                 ref={refOk}
                 onChange={onControlOkChange}/>
    <InputSwitch label={getLocale('studio-stage-autoplay')}
                 key={stage + '-control-autoplay'}
                 id={stage + '-control-autoplay'}
                 ref={refAutoplay}
                 defaultValue={stageNode.control.autoplay}
                 onChange={onControlAutoplayChange}/>
    <InputImage label={getLocale('picture') + ' (640 * 480 pixels)'}
                key={stage + '-image'}
                id={stage + '-image'}
                onChange={onImageChange}
                image={stageNode.newImage ? stageNode.newImage : (stageNode.image ? metadata.path + '/images/' + stageNode.image : undefined)}/>
    <StudioActionForm stageNode={stageNode}/>
  </>
}

export default StudioStageForm