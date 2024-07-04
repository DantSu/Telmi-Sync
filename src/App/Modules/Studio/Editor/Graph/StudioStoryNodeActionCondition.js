import {useStudioStory} from '../Providers/StudioStoryHooks.js'
import {getConditionComparator} from '../Forms/StudioNodesHelpers.js'

import styles from './StudioGraph.module.scss'

function StudioStoryNodeActionCondition({condition}) {
  const
    {nodes} = useStudioStory(),
    item = nodes.inventory.find((v) => v.id === condition.itemId)

  return <li className={styles.nodeActionCondition}>{getConditionComparator()[condition.comparator]} {condition.number} {item.name}</li>
}

export default StudioStoryNodeActionCondition