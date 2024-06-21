import {useCallback, useEffect, useState} from 'react'
import ButtonIconRobot from '../Buttons/Icons/ButtonIconRobot.js'

import styles from './Audio.module.scss'

function AudioTTS({title, onTTSEnded, className}) {
  const
    [isGenerate, setIsGenerate] = useState(false),
    onGenerate = useCallback(
      (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsGenerate(true)
      },
      []
    )


  useEffect(
    () => () => {
      if (isGenerate !== null) {
      }
    },
    [isGenerate]
  )

  return isGenerate ?
            <ButtonIconRobot className={[styles.active, className].join(' ')} title={title} onClick={onGenerate}/> :
            <ButtonIconRobot className={className} title={title} onClick={onGenerate}/>
}

export default AudioTTS