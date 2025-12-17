import {useEffect, useMemo, useState} from 'react'
import {useLocale} from '../../Locale/LocaleHooks.js'
import AudioWaveformContainer from './AudioWaveformContainer.js'
import ButtonIconPlay from '../../Buttons/Icons/ButtonIconPlay.js'
import ButtonIconMagnifyingGlassMinus from '../../Buttons/Icons/ButtonIconMagnifyingGlassMinus.js'
import ButtonIconMagnifyingGlassPlus from '../../Buttons/Icons/ButtonIconMagnifyingGlassPlus.js'
import ButtonIconPause from '../../Buttons/Icons/ButtonIconPause.js'
import ButtonIconStop from '../../Buttons/Icons/ButtonIconStop.js'
import ButtonIconCrop from '../../Buttons/Icons/ButtonIconCrop.js'
import AudioButtonValidCrop from './AudioButtonValidCrop.js'
import AudioButtonAmplification from './AudioButtonAmplification.js'

import styles from './AudioEdit.module.scss'

function AudioEdit({mp3Path, setNewMp3Path}) {
  const
    {getLocale} = useLocale(),
    [player, setPlayer] = useState(() => ({audio: null, isPlaying: false})),
    setPlayerPosition = useMemo(
      () => {
        if (player.audio === null) {
          return null
        }
        return (position) => {
          setPlayer((p) => {
            if (!isNaN(p.audio.duration)) {
              p.audio.currentTime = position * p.audio.duration
            }
            return {...p}
          })
        }
      },
      [player.audio]
    ),
    [zoom, setZoom] = useState(1),
    [croppingData, setCroppingData] = useState(null)

  useEffect(
    () => {
      const audio = new Audio(mp3Path + '?nocache=' + Date.now())

      setPlayer({audio, isPlaying: false})

      return () => setPlayer(p => {
        if (p !== null) {
          p.audio.pause()
          p.audio.remove()
        }
        return {audio: null, isPlaying: false}
      })
    },
    [mp3Path]
  )

  useEffect(
    () => {
      if (player.audio === null) {
        return
      }

      if (croppingData === null) {
        const endedListener = () => setPlayer((p) => {
          p.audio.currentTime = 0
          return {...p, isPlaying: false}
        })
        player.audio.addEventListener('ended', endedListener)
        return () => player.audio.removeEventListener('ended', endedListener)
      }

      if (
        player.audio.currentTime < croppingData.start ||
        player.audio.currentTime > croppingData.end
      ) {
        setPlayer((p) => {
          p.audio.currentTime = croppingData.start
          return {...p}
        })
      }

      const
        endedListener = () => setPlayer((p) => {
          p.audio.currentTime = croppingData !== null ? croppingData.start : 0
          return {...p, isPlaying: false}
        })

      player.audio.addEventListener('ended', endedListener)

      if (!player.isPlaying) {
        return () => player.audio.removeEventListener('ended', endedListener)
      }

      const interval = setInterval(
        () => {
          if (player.audio.currentTime >= croppingData.end) {
            clearInterval(interval)
            player.audio.pause()
            player.audio.currentTime = croppingData.start
            setPlayer((p) => ({...p, isPlaying: false}))
          }
        },
        10
      )

      return () => {
        player.audio.removeEventListener('ended', endedListener)
        clearInterval(interval)
      }
    },
    [croppingData, player]
  )

  return <div className={styles.container}>
    <AudioWaveformContainer key={mp3Path}
                            player={player}
                            setPlayerPosition={setPlayerPosition}
                            croppingData={croppingData}
                            setCroppingData={setCroppingData}
                            mp3Path={mp3Path}
                            zoom={zoom}/>
    <div className={styles.buttons}>
      {
        !player.isPlaying ?
          <ButtonIconPlay className={styles.button}
                          title={getLocale('play')}
                          onClick={() => {
                            if (player.audio !== null) {
                              player.audio.play()
                              setPlayer((p) => ({...p, isPlaying: true}))
                            }
                          }}/> :
          <ButtonIconPause className={styles.button}
                           title={getLocale('pause')}
                           onClick={() => {
                             player.audio.pause()
                             setPlayer((p) => ({...p, isPlaying: false}))
                           }}/>
      }
      <ButtonIconStop className={styles.button}
                      title={getLocale('stop')}
                      onClick={() => {
                        if (player.audio !== null) {
                          player.audio.pause()
                          player.audio.currentTime = croppingData !== null ? croppingData.start : 0
                          setPlayer((p) => ({...p, isPlaying: false}))
                        }
                      }}/>
      {
        croppingData === null ?
          <ButtonIconCrop className={styles.button}
                          title={getLocale('audio-crop')}
                          onClick={() => player.audio !== null &&
                            !isNaN(player.audio.duration) &&
                            setCroppingData({start: '0', end: player.audio.duration.toFixed(3)})
                          }/> :
          <AudioButtonValidCrop mp3Path={mp3Path}
                                player={player}
                                croppingData={croppingData}
                                setCroppingData={setCroppingData}
                                title={getLocale('audio-crop')}
                                setNewMp3Path={setNewMp3Path}/>
      }
      <AudioButtonAmplification setNewMp3Path={setNewMp3Path}
                                mp3Path={mp3Path}/>
      <ButtonIconMagnifyingGlassMinus className={styles.button}
                                      title={getLocale('zoom-out')}
                                      onClick={() => setZoom((z) => (z > 1) ? z - 1 : 1)}/>
      <ButtonIconMagnifyingGlassPlus className={styles.button}
                                     title={getLocale('zoom-in')}
                                     onClick={() => setZoom((z) => (z < 20) ? z + 1 : 20)}/>
    </div>
  </div>
}

export default AudioEdit