import {SVG_ANCHOR_CENTER, SVG_ANCHOR_MIDDLE} from '../../../../Components/SVG/SVGConstants.js'
import SVGHtml from '../../../../Components/SVG/SVGHtml.js'

import styles from './StudioGraph.module.scss'

function StudioStoryNodeStage({image, title, x, y, isSelected, onClick, onMouseDown, onDragStart, isAutoplay, isOkButton}) {
  return <SVGHtml x={x}
                  y={y}
                  width={80}
                  height={80}
                  anchorX={SVG_ANCHOR_CENTER}
                  anchorY={SVG_ANCHOR_MIDDLE}>
    <div className={[
      isSelected ? styles.nodeStageSelected : styles.nodeStage,
      isAutoplay ? styles.nodeStageAutoplay : undefined,
      isOkButton ? styles.nodeStageOkButton : undefined,
    ].join(' ')}
         onClick={onClick}
         onMouseDown={onMouseDown}
         draggable={typeof onDragStart === 'function'}
         onDragStart={onDragStart}>
      <div className={styles.nodeStageImg}>
        {image && <img src={image} alt=""/>}
      </div>
      <h3 className={styles.nodeStageTitle} title={title}>{title}</h3>
    </div>
  </SVGHtml>
}

export default StudioStoryNodeStage