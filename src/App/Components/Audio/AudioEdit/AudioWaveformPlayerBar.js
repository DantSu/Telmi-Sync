import {useEffect, useState} from 'react'

import styles from './AudioEdit.module.scss'

const getPlayerPos = (player, width) => {
  return player.audio.currentTime / (player.audio.duration || player.audio.currentTime) * width
}

function AudioWaveformPlayerBar({player, defaultWidth, zoom}) {
  const
    width = defaultWidth * zoom,
    [barPos, setBarPos] = useState(0)

  useEffect(
    () => {
      if(player.audio === null) {
        return
      }
      setBarPos(getPlayerPos(player, width))
      if (player.isPlaying) {
        const interval = setInterval(
          () => setBarPos(getPlayerPos(player, width)),
          50
        )
        return () => clearInterval(interval)
      }
    },
    [player, width]
  )

  return <div className={styles.playerBar} style={{left: barPos + 'px'}}/>
}

export default AudioWaveformPlayerBar