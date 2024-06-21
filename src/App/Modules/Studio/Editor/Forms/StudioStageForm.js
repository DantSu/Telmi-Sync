import {useCallback} from 'react'
import {useLocale} from '../../../../Components/Locale/LocaleHooks.js'
import {useStudioStage} from '../Providers/StudioStageHooks.js'
import {useStudioStory, useStudioStoryUpdater} from '../Providers/StudioStoryHooks.js'

import InputText from '../../../../Components/Form/Input/InputText.js'
import InputTextarea from '../../../../Components/Form/Input/InputTextarea.js'
import InputImage from '../../../../Components/Form/Input/InputImage.js'
import InputAudio from '../../../../Components/Form/Input/InputAudio.js'

function StudioStageForm() {
  const
    {getLocale} = useLocale(),
    {stage} = useStudioStage(),
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
    )

  return <>
    <InputText label={getLocale('title')}
               key={stage + '-title'}
               defaultValue={note.title}
               onBlur={onTitleBlur}/>
    <InputTextarea label={getLocale('notes')}
                   key={stage + '-notes'}
                   defaultValue={note.notes}
                   onBlur={onNotesBlur}/>
    <InputImage label={getLocale('picture')}
                key={stage + '-image'}
                onChange={onImageChange}
                image={stageNode.image ? metadata.path + '/images/' + stageNode.image : undefined}/>
    <InputAudio label={getLocale('audio')}
                key={stage + '-audio'}
                onChange={onAudioChange}
                audio={stageNode.audio ? metadata.path + '/audios/' + stageNode.audio : undefined}/>
  </>
}

export default StudioStageForm