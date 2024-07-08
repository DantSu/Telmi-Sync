import {SVG_ANCHOR_CENTER, SVG_ANCHOR_MIDDLE} from '../../../../Components/SVG/SVGConstants.js'
import SVGHtml from '../../../../Components/SVG/SVGHtml.js'
import StudioStoryNodeActionCondition from './StudioStoryNodeActionCondition.js'

import styles from './StudioGraph.module.scss'

function StudioStoryNodeAction({action, x, y}) {
  return <SVGHtml x={x}
                  y={y}
                  width={64}
                  height={64}
                  anchorX={SVG_ANCHOR_CENTER}
                  anchorY={SVG_ANCHOR_MIDDLE}>
    <div className={styles.nodeActionContainer}>
      <ul className={styles.nodeAction}>{
        Array.isArray(action.conditions) &&
        action.conditions.map((condition, k) => <StudioStoryNodeActionCondition key={'story-action-condition-' + k} condition={condition}/>)
      }</ul>
    </div>
  </SVGHtml>
}

export default StudioStoryNodeAction