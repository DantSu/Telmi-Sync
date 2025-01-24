import {useCallback} from 'react'
import {useStudioStory} from '../Providers/StudioStoryHooks.js'
import {useStudioForm} from '../Providers/StudioStageHooks.js'

import StudioStoryNodeStage from './StudioStoryNodeStage.js'
import StudioStoryStageDropContext from './StudioStoryStageDropContext.js'

const stageId = 'startStage'

function StudioStoryStartStage({x, y, setContextMenu}) {
  const
    {story: {metadata, nodes}} = useStudioStory(),
    {form: stage, setForm} = useStudioForm(),
    onClick = useCallback(() => setForm((s) => s === stageId ? null : stageId), [setForm]),
    onDrop = useCallback(
      (e) => {
        if (
          nodes.stages[e.dataTransfer.getData('stageId')] === undefined ||
          stageId === e.dataTransfer.getData('stageId')
        ) {
          return
        }
        setContextMenu(
          <StudioStoryStageDropContext x={x}
                                       y={y}
                                       stageSrc={e.dataTransfer.getData('stageId')}
                                       stageDst={stageId}
                                       setContextMenu={setContextMenu}/>
        )
      },
      [nodes, setContextMenu, x, y]
    )

  return <StudioStoryNodeStage image={metadata.newImageTitle || metadata.imageTitle}
                               audio={metadata.newAudioTitle || metadata.audioTitle}
                               title={metadata.title}
                               onClick={onClick}
                               isSelected={stage === stageId}
                               onDrop={onDrop}
                               x={x}
                               y={y}/>
}

export default StudioStoryStartStage