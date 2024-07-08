import {useCallback} from 'react'
import {useStudioStory, useStudioStoryUpdater} from '../../Providers/StudioStoryHooks.js'
import {useStudioForm} from '../../Providers/StudioStageHooks.js'
import ButtonIconTrash from '../../../../../Components/Buttons/Icons/ButtonIconTrash.js'

import styles from './StudioStageForm.module.scss'

function StudioStageInventoryUpdateForm({rule, rulePosition}) {
  const 
    {nodes} = useStudioStory(),
    {form: stage} = useStudioForm(),
    {updateStory} = useStudioStoryUpdater(),
    parentStage = nodes.stages[stage],
    item = nodes.inventory.find((v) => v.id === rule.item),
    
    onDelete = useCallback(
      () => {
        updateStory((s) => {
          parentStage.items.splice(rulePosition, 1)
          if(!parentStage.items.length) {
            delete parentStage.items
          }
          return {
            ...s,
            nodes: {...s.nodes}
          }
        })
      },
      [parentStage, rulePosition, updateStory]
    )
  
  return <li className={styles.inventoryUpdate}>
    <span className={styles.actionItemText}>{rule.number > 0 ? '+' : ''}{rule.number} {item.name}</span>
    <ButtonIconTrash className={styles.actionItemButton} onClick={onDelete}/>
  </li>
}

export default StudioStageInventoryUpdateForm