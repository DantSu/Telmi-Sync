import {useCallback, useEffect, useRef, useState} from 'react'

import StudioStoryEditorGraph from './StudioStoryEditorGraph.js'
import ButtonIconMagnifyingGlassPlus from '../../../../Components/Buttons/Icons/ButtonIconMagnifyingGlassPlus.js'
import ButtonIconMagnifyingGlassMinus from '../../../../Components/Buttons/Icons/ButtonIconMagnifyingGlassMinus.js'


import styles from './StudioGraph.module.scss'
import {useLocale} from '../../../../Components/Locale/LocaleHooks.js'

function StudioStoryEditorGraphContainer() {
  const
    {getLocale} = useLocale(),
    [grabbing, setGrabbing] = useState(false),
    [scale, setScale] = useState(10),
    ref = useRef(null),
    grabStart = useCallback(() => setGrabbing(true), []),
    grabEnd = useCallback(() => setGrabbing(false), []),
    grabMove = useCallback(
      (e) => {
        if (grabbing) {
          ref.current.scrollLeft -= e.movementX
          ref.current.scrollTop -= e.movementY
        }
      },
      [grabbing]
    )

  useEffect(
    () => {
      ref.current.scrollLeft = (ref.current.scrollWidth - ref.current.clientWidth) / 2
    },
    []
  );

  return <div className={styles.graphContainer}>
    <ul className={styles.zoomContainer}>
      <li className={styles.zoomText}>{scale * 10}%</li>
      <li>
        <ButtonIconMagnifyingGlassMinus className={scale === 2 ? styles.zoomButtonDisabled : styles.zoomButton}
                                          title={getLocale('zoom-out')}
                                          onClick={() => setScale((s) => {
                                            const ns = s - 1
                                            return ns <= 2 ? 2 : ns
                                          })}/>
        <ButtonIconMagnifyingGlassPlus className={scale === 10 ? styles.zoomButtonDisabled : styles.zoomButton}
                                         title={getLocale('zoom-in')}
                                         onClick={() => setScale((s) => {
                                           const ns = s + 1
                                           return ns >= 10 ? 10 : ns
                                         })}/>
      </li>
    </ul>
    <div className={styles.graph}
         ref={ref}
         onMouseMove={grabMove}
         onMouseDown={grabStart}
         onMouseUp={grabEnd}
         onMouseLeave={grabEnd}>
      <StudioStoryEditorGraph scale={scale / 10}/>
    </div>
  </div>
}

export default StudioStoryEditorGraphContainer