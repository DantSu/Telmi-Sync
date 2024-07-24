import {useCallback} from 'react'
import {useStudioStory} from '../Providers/StudioStoryHooks.js'
import {useStudioForm} from '../Providers/StudioStageHooks.js'

import StudioStoryNodeStage from './StudioStoryNodeStage.js'

const stageId = 'startStage'

function StudioStoryStartStage({x, y}) {
  const
    {story: {metadata}} = useStudioStory(),
    {form: stage, setForm} = useStudioForm(),
    onClick = useCallback(() => setForm((s) => s === stageId ? null : stageId), [setForm])

  return <StudioStoryNodeStage image={metadata.newImageTitle || metadata.imageTitle}
                               audio={metadata.newAudioTitle || metadata.audioTitle}
                               title={metadata.title}
                               onClick={onClick}
                               isSelected={stage === stageId}
                               x={x}
                               y={y} />
}

export default StudioStoryStartStage