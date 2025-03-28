import {useCallback} from 'react'
import {useLocale} from '../../../../../Components/Locale/LocaleHooks.js'
import {useStudioStory, useStudioStoryUpdater} from '../../Providers/StudioStoryHooks.js'
import {useStudioForm} from '../../Providers/StudioStageHooks.js'
import {getAssigmentOperators} from '../StudioNodesHelpers.js'
import ButtonIconTrash from '../../../../../Components/Buttons/Icons/ButtonIconTrash.js'

import styles from './StudioStageForm.module.scss'

function StudioStageInventoryUpdateForm({rule, rulePosition}) {
  const
    {getLocale} = useLocale(),
    {story: {nodes}} = useStudioStory(),
    {form: stage} = useStudioForm(),
    {updateStory} = useStudioStoryUpdater(),
    parentStage = nodes.stages[stage],
    item = nodes.inventory.find((v) => v.id === rule.item),
    assignItem = rule.assignItem !== undefined ? nodes.inventory.find((v) => v.id === rule.assignItem) : null,
    
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
    <span className={styles.actionItemText}>
      {item.name}&nbsp;
      {getAssigmentOperators()[rule.type]}&nbsp;
      {rule.number !== undefined && rule.number}
      {assignItem !== null && assignItem.name}
      {rule.playingTime && getLocale('playing-time')}
    </span>
    <ButtonIconTrash className={styles.actionItemButton}
                     onClick={onDelete}/>
  </li>
}

export default StudioStageInventoryUpdateForm