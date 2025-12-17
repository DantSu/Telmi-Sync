import {useEffect, useRef, useState} from 'react'
import {useElectronEmitter, useElectronListener} from '../../Electron/Hooks/UseElectronEvent.js'

import Loader from '../../Loader/Loader.js'
import AudioWaveform from './AudioWaveform.js'
import AudioWaveformPlayerBar from './AudioWaveformPlayerBar.js'
import AudioWaveformCrop from './AudioWaveformCrop.js'

import styles from './AudioEdit.module.scss'


function AudioWaveformContainer({mp3Path, zoom, player, setPlayerPosition, croppingData, setCroppingData}) {
  const
    [samples, setSamples] = useState(null),
    [, setSizeChanged] = useState(0),
    containerRef = useRef(null)

  useElectronListener('audio-analyze-data', (s) => setSamples(s), [])
  useElectronEmitter('audio-analyze-request', [mp3Path])

  useEffect(() => {
    const resizer = () => {
      setSizeChanged((s) => s + 1)
    }
    window.addEventListener('resize', resizer)
    return () => {
      window.removeEventListener('resize', resizer)
    }
  }, [])

  useEffect(
    () => {
      if (player.audio === null) {
        return
      }
      containerRef.current.scrollLeft = Math.max(
        Math.min(
          player.audio.currentTime / player.audio.duration * zoom * containerRef.current.offsetWidth - containerRef.current.offsetWidth / 2,
          zoom * containerRef.current.offsetWidth - containerRef.current.offsetWidth
        ),
        0
      )
    },
    [player.audio, zoom]
  )

  return <div className={styles.waveformContainer}>
    <div className={styles.waveformScroll} ref={containerRef}>{
      samples === null || setPlayerPosition === null ? <Loader inline={true}/> : <>
        {
          croppingData !== null && <AudioWaveformCrop croppingData={croppingData}
                                                      setCroppingData={setCroppingData}
                                                      player={player}
                                                      zoom={zoom}
                                                      containerRef={containerRef.current}/>
        }
        <AudioWaveformPlayerBar zoom={zoom}
                                defaultWidth={containerRef.current.offsetWidth}
                                player={player}/>
        <AudioWaveform samples={samples}
                       zoom={zoom}
                       setPlayerPosition={setPlayerPosition}
                       defaultWidth={containerRef.current.offsetWidth}/>
      </>
    }</div>
  </div>
}

export default AudioWaveformContainer