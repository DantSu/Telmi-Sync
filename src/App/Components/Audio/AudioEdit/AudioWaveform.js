import {memo} from 'react'

import styles from './AudioEdit.module.scss'

const
  height = 64,
  middle = height / 2

function AudioWaveform({samples, zoom, defaultWidth, setPlayerPosition}) {
  const
    width = zoom * defaultWidth,
    divideFrequency = Math.floor(samples.length / width) || 1,
    pointsLength = Math.floor(samples.length / divideFrequency),
    points = new Array(pointsLength).fill(0).map((v, i) => {
      const
        iSamples = i * divideFrequency,
        iSamplesEnd = iSamples + divideFrequency,
        slicedSamples = samples.slice(iSamples, iSamplesEnd),
        x = ((i / pointsLength) * width).toFixed(1),
        y1 = (middle - ((Math.min(...slicedSamples) - 127) / 127) * middle).toFixed(1),
        y2 = (middle - ((Math.max(...slicedSamples) - 127) / 127) * middle).toFixed(1)
      return `${x},${y1},${x},${y2}`
    })

  return (
    <svg width={width}
         height={height}
         onClick={(e) => setPlayerPosition(e.nativeEvent.offsetX / width)}
         className={styles.waveform}>
      <polyline
        className={styles.waveformPolyline}
        points={`0,${middle},` + points.join(' ') + `,${width},${middle}`}/>
    </svg>
  )
}

export default memo(AudioWaveform)