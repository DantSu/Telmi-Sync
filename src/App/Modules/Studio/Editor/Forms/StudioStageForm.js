import {useCallback} from 'react'
import {useLocale} from '../../../../Components/Locale/LocaleHooks.js'
import {useStudioStage} from '../Providers/StudioStageHooks.js'
import {useStudioStory, useStudioStoryUpdater} from '../Providers/StudioStoryHooks.js'

import InputText from '../../../../Components/Form/Input/InputText.js'
import InputTextarea from '../../../../Components/Form/Input/InputTextarea.js'
import InputImage from '../../../../Components/Form/Input/InputImage.js'

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
      (e) => updateStory((s) => {
        s.nodes.stages[stage].newImage = e.target.files[0].path
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
    <InputImage label={getLocale('image')}
                key={stage + '-image'}
                onChange={onImageChange}
                image={nodes.stages[stage].image ? metadata.path + '/images/' + nodes.stages[stage].image : undefined}/>
  </>
}

export default StudioStageForm