import {useStudioStory} from '../Providers/StudioStoryHooks.js'
import {getComparisonOperators} from '../Forms/StudioNodesHelpers.js'

import styles from './StudioGraph.module.scss'

function StudioStoryNodeActionCondition({condition}) {
  const
    {story: {nodes}} = useStudioStory(),
    item = nodes.inventory.find((v) => v.id === condition.item),
    text = item.name + ' ' +
      getComparisonOperators()[condition.comparator] + ' '  +
      (condition.number !== undefined ? condition.number : '') +
      (condition.compareItem !== undefined ? nodes.inventory.find((v) => v.id === condition.compareItem).name : '')

  return <li className={styles.nodeActionCondition} title={text}>{text}</li>
}

export default StudioStoryNodeActionCondition