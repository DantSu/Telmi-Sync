import {useLocale} from '../../../../Components/Locale/LocaleHooks.js'
import {useStudioStoryUpdater} from '../Providers/StudioStoryHooks.js'
import {addNote, addStage, addStageOption} from '../Forms/StudioNodesHelpers.js'
import {getStageAudioPath, getStageImagePath} from '../../Helpers/FileHelpers.js'
import {metadataToStartStageObject} from '../Forms/StudioStartStageHelpers.js'

import ContextMenuContainer from '../../../../Components/ContextMenu/ContextMenuContainer.js'
import ContextMenuItem from '../../../../Components/ContextMenu/ContextMenuItem.js'
import SVGHtml from '../../../../Components/SVG/SVGHtml.js'
import {SVG_ANCHOR_CENTER, SVG_ANCHOR_TOP} from '../../../../Components/SVG/SVGConstants.js'


import styles from './StudioGraph.module.scss'

function StudioStoryStageDropContext({x, y, stageSrc, stageDst, setContextMenu}) {
  const
    {getLocale} = useLocale(),
    {updateStory} = useStudioStoryUpdater(),
    onClickLink = () => {
      updateStory((s) => {
        return {
          ...s,
          nodes: addStageOption(
            s.nodes,
            stageDst === 'startStage' ? metadataToStartStageObject(s.metadata, s.nodes.startAction) : s.nodes.stages[stageDst],
            stageSrc
          )
        }
      })
    },
    onClickClone = () => {
      updateStory((s) => {
        const
          srcNode = s.nodes.stages[stageSrc],
          stageId = addStage(s.nodes)

        s.nodes.stages[stageId] = Object.assign({
            ...s.nodes.stages[stageId],
            newImage: getStageImagePath(srcNode, s.metadata) || null,
            newAudio: getStageAudioPath(srcNode, s.metadata) || null,
            control: {
              ok: srcNode.control.ok,
              home: srcNode.control.home,
              autoplay: srcNode.control.autoplay
            }
          },
          srcNode.inventoryReset ? {inventoryReset: true} : null,
          Array.isArray(srcNode.items) ? {items: JSON.parse(JSON.stringify(srcNode.items))} : null
        )

        return {
          ...s,
          nodes: addStageOption(s.nodes, s.nodes.stages[stageDst], stageId),
          notes: addNote(s.notes, stageId, stageId)
        }
      })
    },
    onClickCancel = () => {
      setContextMenu(null)
    }

  return <SVGHtml x={x}
                  y={y + 25}
                  width={120}
                  height={200}
                  anchorX={SVG_ANCHOR_CENTER}
                  anchorY={SVG_ANCHOR_TOP}>
    <ContextMenuContainer className={styles.contextMenu}>
      <ContextMenuItem onClick={onClickLink}>{getLocale('link')}</ContextMenuItem>
      <ContextMenuItem onClick={onClickClone}>{getLocale('clone')}</ContextMenuItem>
      <ContextMenuItem onClick={onClickCancel}>{getLocale('cancel')}</ContextMenuItem>
    </ContextMenuContainer>
  </SVGHtml>
}

export default StudioStoryStageDropContext