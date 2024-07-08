import {getConditionComparator} from '../StudioNodesHelpers.js'
import {useStudioStory, useStudioStoryUpdater} from '../../Providers/StudioStoryHooks.js'

import styles from './StudioStageForm.module.scss'
import ButtonIconTrash from '../../../../../Components/Buttons/Icons/ButtonIconTrash.js'
import {useCallback} from 'react'
import {useLocale} from '../../../../../Components/Locale/LocaleHooks.js'

function StudioActionCondition({action, condition, conditionKey}) {
  const
    {getLocale} = useLocale(),
    {nodes} = useStudioStory(),
    {updateStory} = useStudioStoryUpdater(),
    item = nodes.inventory.find((v) => v.id === condition.item),
    onDelete = useCallback(
      () => {
        updateStory((s) => {
          action.conditions.splice(conditionKey, 1)
          return {
            ...s,
            nodes: {...s.nodes}
          }
        })
      },
      [action.conditions, conditionKey, updateStory]
    )

  return <li className={styles.conditionContainer}>
    <span>{getConditionComparator()[condition.comparator]} {condition.number} {item.name}</span>
    <ButtonIconTrash className={styles.conditionButton} onClick={onDelete} title={getLocale('display-condition-delete')}/>
  </li>
}

export default StudioActionCondition
