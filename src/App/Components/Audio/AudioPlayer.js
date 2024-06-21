import {useCallback, useEffect, useState} from 'react'
import ButtonIconPause from '../Buttons/Icons/ButtonIconPause.js'
import ButtonIconPlay from '../Buttons/Icons/ButtonIconPlay.js'
import styles from './Audio.module.scss'


function AudioPlayer({audioPath, title, className}) {
  const
    [isPlaying, setIsPlaying] = useState(null),
    onPlay = useCallback(
      (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsPlaying((a) => {
          if (a === null) {
            const play = new Audio(audioPath)
            play.play()
            play.addEventListener('ended', () => {
              setIsPlaying(null)
            })
            return play
          } else {
            return null
          }
        })
      },
      [audioPath]
    )


  useEffect(
    () => () => {
      if (isPlaying !== null) {
        isPlaying.pause()
        isPlaying.remove()
      }
    },
    [isPlaying]
  )

  return isPlaying ?
            <ButtonIconPause className={[styles.active, className].join(' ')} title={title} onClick={onPlay}/> :
            <ButtonIconPlay className={className} title={title} onClick={onPlay}/>
}

export default AudioPlayer