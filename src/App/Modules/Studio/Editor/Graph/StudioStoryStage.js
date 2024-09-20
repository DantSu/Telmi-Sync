import {useCallback} from 'react'
import {useStudioStory} from '../Providers/StudioStoryHooks.js'
import {useStudioForm} from '../Providers/StudioStageHooks.js'
import {getUpdateInventoryType} from '../Forms/StudioNodesHelpers.js'

import StudioStoryNodeStage from './StudioStoryNodeStage.js'

function StudioStoryStage({stageId, x, y}) {
  const
    {story: {nodes, notes, metadata}} = useStudioStory(),
    {form: stage, setForm} = useStudioForm(),
    currentStage = nodes.stages[stageId],
    onMouseDown = useCallback((e) => e.stopPropagation(), []),
    onDragStart = useCallback(
      (e) => {
        e.dataTransfer.setData('text/plain', e.target.innerText)
        e.dataTransfer.setData('text/html', e.target.outerHTML)
        e.dataTransfer.setData('stageId', stageId)
        e.dataTransfer.effectAllowed = 'link'
      },
      [stageId]
    ),
    onClick = useCallback(
      (e) => {
        e.preventDefault()
        e.stopPropagation()
        setForm((s) => s === stageId ? null : stageId)
      },
      [stageId, setForm]
    ),
    inventoryUpdate = Array.isArray(currentStage.items) ?
      currentStage.items.map((rule) => {
        const item = nodes.inventory.find((v) => v.id === rule.item)
        return getUpdateInventoryType()[rule.type] + rule.number + ' ' + item.name
      }).join('\n') : undefined

  return <StudioStoryNodeStage
    image={currentStage.newImage || (currentStage.image ? metadata.path + '/images/' + currentStage.image : undefined)}
    audio={currentStage.newAudio || (currentStage.audio ? metadata.path + '/audios/' + currentStage.audio : undefined)}
    inventoryUpdate={inventoryUpdate}
    title={notes[stageId].title}
    color={notes[stageId].color}
    isSelected={stage === stageId}
    onClick={onClick}
    onDragStart={onDragStart}
    onMouseDown={onMouseDown}
    isAutoplay={currentStage.control.autoplay}
    isOkButton={currentStage.control.ok}
    x={x}
    y={y}/>
}

export default StudioStoryStage