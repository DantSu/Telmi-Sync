import {useStudioStory} from '../Providers/StudioStoryHooks.js'
import {getConditionComparator} from '../Forms/StudioNodesHelpers.js'

import styles from './StudioGraph.module.scss'

function StudioStoryNodeActionCondition({condition}) {
  const
    {story: {nodes}} = useStudioStory(),
    item = nodes.inventory.find((v) => v.id === condition.item),
    text = getConditionComparator()[condition.comparator] + condition.number + ' ' + item.name

  return <li className={styles.nodeActionCondition} title={text}>{text}</li>
}

export default StudioStoryNodeActionCondition