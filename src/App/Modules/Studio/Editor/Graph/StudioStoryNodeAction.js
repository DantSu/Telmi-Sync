import {SVG_ANCHOR_CENTER, SVG_ANCHOR_MIDDLE} from '../../../../Components/SVG/SVGConstants.js'
import SVGHtml from '../../../../Components/SVG/SVGHtml.js'

import styles from '../StudioStoryEditor.module.scss'

function StudioStoryNodeAction({x, y}) {
  return <SVGHtml x={x}
                  y={y}
                  width={64}
                  height={64}
                  anchorX={SVG_ANCHOR_CENTER}
                  anchorY={SVG_ANCHOR_MIDDLE}>
    <div className={styles.nodeActionContainer}>
      <div className={styles.nodeAction}>

      </div>
    </div>
  </SVGHtml>
}

export default StudioStoryNodeAction