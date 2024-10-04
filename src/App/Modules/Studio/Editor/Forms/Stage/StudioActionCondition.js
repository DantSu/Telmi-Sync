import {useCallback} from 'react'
import {useLocale} from '../../../../../Components/Locale/LocaleHooks.js'
import {getComparisonOperators} from '../StudioNodesHelpers.js'
import {useStudioStory, useStudioStoryUpdater} from '../../Providers/StudioStoryHooks.js'

import ButtonIconTrash from '../../../../../Components/Buttons/Icons/ButtonIconTrash.js'

import styles from './StudioStageForm.module.scss'

function StudioActionCondition({action, condition, conditionKey}) {
  const
    {getLocale} = useLocale(),
    {story: {nodes}} = useStudioStory(),
    {updateStory} = useStudioStoryUpdater(),
    item = nodes.inventory.find((v) => v.id === condition.item),
    compareItem = condition.compareItem !== undefined ? nodes.inventory.find((v) => v.id === condition.compareItem) : null,
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
    <span>
      {item.name}&nbsp;
      {getComparisonOperators()[condition.comparator]}&nbsp;
      {condition.number !== undefined && condition.number}
      {compareItem !== null && compareItem.name}
    </span>
    <ButtonIconTrash className={styles.conditionButton} onClick={onDelete} title={getLocale('display-condition-delete')}/>
  </li>
}

export default StudioActionCondition
