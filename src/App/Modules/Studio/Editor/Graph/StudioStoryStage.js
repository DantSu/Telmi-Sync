import {useCallback} from 'react'
import {useStudioStory} from '../Providers/StudioStoryHooks.js'
import {useStudioStage} from '../Providers/StudioStageHooks.js'

import StudioStoryNodeStage from './StudioStoryNodeStage.js'

function StudioStoryStage({stageId, x, y}) {
  const
    {nodes, notes, metadata} = useStudioStory(),
    {stage, setStage} = useStudioStage(),
    currentStage = nodes.stages[stageId],
    onClick = useCallback(() => setStage((s) => s === stageId ? null : stageId), [stageId, setStage])
  return <StudioStoryNodeStage image={currentStage.newImage || (currentStage.image ? metadata.path + '/images/' + currentStage.image : undefined)}
                               title={notes[stageId].title}
                               onClick={onClick}
                               isSelected={stage === stageId}
                               x={x}
                               y={y}/>
}

export default StudioStoryStage