import {useLocale} from '../../../../Components/Locale/LocaleHooks.js'
import {SVG_ANCHOR_CENTER, SVG_ANCHOR_MIDDLE} from '../../../../Components/SVG/SVGConstants.js'
import SVGHtml from '../../../../Components/SVG/SVGHtml.js'

import styles from './StudioGraph.module.scss'

function StudioStoryNodeStage({
                                image,
                                audio,
                                inventoryUpdate,
                                title,
                                color,
                                x,
                                y,
                                isSelected,
                                onClick,
                                onMouseDown,
                                onDragStart,
                                isAutoplay,
                                isOkButton
                              }) {
  const {getLocale} = useLocale()

  return <SVGHtml x={x}
                  y={y}
                  width={80}
                  height={80}
                  anchorX={SVG_ANCHOR_CENTER}
                  anchorY={SVG_ANCHOR_MIDDLE}>
    <div className={[
      isSelected ? styles.nodeStageSelected : styles.nodeStage,
      isAutoplay ? styles.nodeStageAutoplay : undefined,
      styles[color] !== undefined ? styles[color] : undefined
    ].join(' ')}
         onClick={onClick}
         onMouseDown={onMouseDown}
         draggable={typeof onDragStart === 'function'}
         onDragStart={onDragStart}>
      <ul className={styles.icons}>
        {
          typeof audio !== 'string' &&
          <li className={styles.redIcon} title={getLocale('no-audio-file')}>{'\uf6a9'}</li>
        }
        {
          typeof inventoryUpdate === 'string' && inventoryUpdate !== '' &&
          <li className={styles.icon} title={inventoryUpdate}>{'\uf552'}</li>
        }
        {isOkButton && <li className={styles.iconText} title={getLocale('press-a-to-go-next')}>A</li>}
      </ul>
      <div className={styles.nodeStageImg}>
        {image && <img src={image} alt=""/>}
      </div>
      <h3 className={styles.nodeStageTitle} title={title}>{title}</h3>
    </div>
  </SVGHtml>
}

export default StudioStoryNodeStage