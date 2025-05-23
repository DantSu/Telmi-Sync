import {useCallback} from 'react'
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
                                onDrop,
                                isAutoplay,
                                isOkButton,
                                version
                              }) {

  const
    {getLocale} = useLocale(),
    stageTitle = title + (image ? '\n' + getLocale('picture') + ' : ' + image : '') + (audio ? '\n' + getLocale('audio') + ' : ' + audio : ''),
    onDragEnterCb = useCallback((e) => e.target.classList.add(styles.nodeStageDragOver), []),
    onDragLeaveCb = useCallback((e) => e.target.classList.remove(styles.nodeStageDragOver), []),
    onDragOverCb = useCallback(
      (e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'link'
      },
      []
    ),
    onDropCb = useCallback(
      (e) => {
        e.target.classList.remove(styles.nodeStageDragOver)
        onDrop(e)
      },
      [onDrop]
    )

  return <SVGHtml x={x}
                  y={y}
                  width={80}
                  height={80}
                  anchorX={SVG_ANCHOR_CENTER}
                  anchorY={SVG_ANCHOR_MIDDLE}>
    <div title={stageTitle}
         className={[
           isSelected ? styles.nodeStageSelected : styles.nodeStage,
           isAutoplay ? styles.nodeStageAutoplay : undefined,
           styles[color] !== undefined ? styles[color] : undefined
         ].join(' ')}
         onClick={onClick}
         onMouseDown={onMouseDown}
         draggable={typeof onDragStart === 'function'}
         onDragStart={onDragStart}
         onDragOver={typeof onDrop === 'function' ? onDragOverCb : undefined}
         onDrop={typeof onDrop === 'function' ? onDropCb : undefined}
         onDragEnter={typeof onDrop === 'function' ? onDragEnterCb : undefined}
         onDragLeave={typeof onDrop === 'function' ? onDragLeaveCb : undefined}>
      <ul className={styles.icons}>
        {!audio && <li className={styles.redIcon} title={getLocale('no-audio-file')}>{'\uf6a9'}</li>}
        {
          typeof inventoryUpdate === 'string' && inventoryUpdate !== '' &&
          <li className={styles.icon} title={inventoryUpdate}>{'\uf552'}</li>
        }
        {isOkButton && <li className={styles.iconText} title={getLocale('press-a-to-go-next')}>A</li>}
      </ul>
      <div className={styles.nodeStageImg}>
        {image && <img src={image + '?version=' + version} alt=""/>}
      </div>
      <h3 className={styles.nodeStageTitle}>{title}</h3>
    </div>
  </SVGHtml>
}

export default StudioStoryNodeStage