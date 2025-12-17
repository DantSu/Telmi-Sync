import {useEffect, useRef, useState} from 'react'

import styles from './AudioEdit.module.scss'

const
  globalXPosition = (containerRef) => {
    return containerRef === null ? 0 : containerRef.offsetLeft + globalXPosition(containerRef.offsetParent)
  },
  displayBracketPosition = (bracketLeftRef, bracketRightRef, containerRef, containerXPos, startMovingState, event) => {
    if (startMovingState === bracketLeftRef) {
      startMovingState.current.style.right = Math.min(
        Math.max(
          containerRef.offsetWidth - (event.clientX - containerXPos) - containerRef.scrollLeft,
          Math.max(-1 * containerRef.scrollLeft, containerRef.offsetWidth - bracketRightRef.current.offsetLeft) + 30
        ),
        containerRef.offsetWidth - containerRef.scrollLeft
      ) + 'px'
    } else {
      startMovingState.current.style.left = Math.min(
        Math.max(
          event.clientX - containerXPos + containerRef.scrollLeft,
          Math.max(containerRef.scrollLeft, bracketLeftRef.current.offsetWidth) + 30
        ),
        containerRef.offsetWidth + containerRef.scrollLeft
      ) + 'px'
    }
  }


function AudioWaveformCrop({croppingData, setCroppingData, player, containerRef, zoom}) {
  const
    [startMovingState, setStartMovingState] = useState(null),
    bracketLeftRef = useRef(null),
    bracketRightRef = useRef(null),
    defaultWidth = containerRef.offsetWidth,
    width = defaultWidth * zoom

  useEffect(
    () => {
      if (startMovingState === null) {
        return
      }
      const
        containerXPos = globalXPosition(containerRef),
        handleMouseMove = (e) => displayBracketPosition(bracketLeftRef, bracketRightRef, containerRef, containerXPos, startMovingState, e),
        handleMouseUp = (e) => {
          displayBracketPosition(bracketLeftRef, bracketRightRef, containerRef, containerXPos, startMovingState, e)
          setCroppingData({
            start: (bracketLeftRef.current.offsetWidth / width * player.audio.duration).toFixed(3),
            end: (bracketRightRef.current.offsetLeft / width * player.audio.duration).toFixed(3)
          })
          setStartMovingState(null)
        }
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    },
    [containerRef, player.audio, setCroppingData, startMovingState, width]
  )

  useEffect(
    () => {
      bracketRightRef.current.style.right = (defaultWidth - width) + 'px'
      bracketRightRef.current.style.left = (croppingData.end / player.audio.duration * width) + 'px'
      bracketLeftRef.current.style.right = (defaultWidth - (croppingData.start / player.audio.duration * width)) + 'px'
    },
    [width, defaultWidth, player, croppingData]
  )

  return <>
    <div className={styles.bracketLeftContainer}
         ref={bracketLeftRef}>
      <button className={styles.bracketLeft}
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setStartMovingState(bracketLeftRef)
              }}/>
    </div>
    <div className={styles.bracketRightContainer}
         ref={bracketRightRef}>
      <button className={styles.bracketRight}
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setStartMovingState(bracketRightRef)
              }}/>
    </div>
  </>
}

export default AudioWaveformCrop