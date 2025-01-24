import {useCallback} from 'react'
import {useLocale} from '../../../../Components/Locale/LocaleHooks.js'
import {useStudioStory} from '../Providers/StudioStoryHooks.js'
import {useStudioForm} from '../Providers/StudioStageHooks.js'
import {getAssigmentOperators} from '../Forms/StudioNodesHelpers.js'

import StudioStoryNodeStage from './StudioStoryNodeStage.js'
import StudioStoryStageDropContext from './StudioStoryStageDropContext.js'

function StudioStoryStage({stageId, x, y, setContextMenu}) {
  const
    {getLocale} = useLocale(),
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
      [nodes.stages, setContextMenu, stageId, x, y]
    ),
    onClick = useCallback(
      (e) => {
        e.preventDefault()
        e.stopPropagation()
        setForm((s) => s === stageId ? null : stageId)
      },
      [stageId, setForm]
    ),
    getInventoryUpdateString = () => {
      const
        inventoryReset = currentStage.inventoryReset ? getLocale('inventory-reset') + '\n' : '',
        inventoryUpdate = Array.isArray(currentStage.items) ?
          currentStage.items.map((rule) => {
            const item = nodes.inventory.find((v) => v.id === rule.item)
            return item.name + ' ' +
              getAssigmentOperators()[rule.type] + ' ' +
              (rule.number !== undefined ? rule.number : '') +
              (rule.assignItem !== undefined ? nodes.inventory.find((v) => v.id === rule.assignItem).name : '') +
              (rule.playingTime ? getLocale('playing-time') : '')
          }).join('\n') : ''
      return inventoryReset + inventoryUpdate
    }


  return <StudioStoryNodeStage
    image={currentStage.newImage || (currentStage.image ? metadata.path + '/images/' + currentStage.image : undefined)}
    audio={currentStage.newAudio || (currentStage.audio ? metadata.path + '/audios/' + currentStage.audio : undefined)}
    inventoryUpdate={getInventoryUpdateString()}
    title={notes[stageId].title}
    color={notes[stageId].color}
    isSelected={stage === stageId}
    onClick={onClick}
    onDragStart={onDragStart}
    onDrop={onDrop}
    onMouseDown={onMouseDown}
    isAutoplay={currentStage.control.autoplay}
    isOkButton={currentStage.control.ok}
    x={x}
    y={y}/>
}

export default StudioStoryStage