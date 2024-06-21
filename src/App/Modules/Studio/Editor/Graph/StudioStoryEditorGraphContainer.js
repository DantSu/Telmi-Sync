import {useCallback, useEffect, useRef, useState} from 'react'

import StudioStoryEditorGraph from './StudioStoryEditorGraph.js'


import styles from './StudioGraph.module.scss'

function StudioStoryEditorGraphContainer() {
  const
    [grabbing, setGrabbing] = useState(false),
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
    <div className={styles.graph}
         ref={ref}
         onMouseMove={grabMove}
         onMouseDown={grabStart}
         onMouseUp={grabEnd}
         onMouseLeave={grabEnd}>
      <StudioStoryEditorGraph/>
    </div>
  </div>
}

export default StudioStoryEditorGraphContainer