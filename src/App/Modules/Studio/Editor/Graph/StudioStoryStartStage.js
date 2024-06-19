import {useCallback} from 'react'
import {useStudioStory} from '../Providers/StudioStoryHooks.js'

import StudioStoryNodeStage from './StudioStoryNodeStage.js'
import {useStudioStage} from '../Providers/StudioStageHooks.js'

const stageId = 'startStage'

function StudioStoryStartStage({x, y}) {
  const
    {metadata} = useStudioStory(),
    {stage, setStage} = useStudioStage(),
    onClick = useCallback(() => setStage((s) => s === stageId ? null : stageId), [setStage])


  return <StudioStoryNodeStage image={metadata.path + '/title.png'}
                               title={metadata.title}
                               onClick={onClick}
                               isSelected={stage === stageId}
                               x={x}
                               y={y}/>
}

export default StudioStoryStartStage