import {useCallback, useState} from 'react'
import {useModal} from '../Modal/ModalHooks.js'
import {useElectronListener} from '../Electron/Hooks/UseElectronEvent.js'
import ModalElectronTaskVisualizer from '../Electron/Modal/ModalElectronTaskVisualizer.js'
import ButtonIconRobot from '../Buttons/Icons/ButtonIconRobot.js'
import ModalDialogAlertLocale from '../Modal/Templates/ModalDialogs/ModalDialogAlertLocale.js'

import styles from './Audio.module.scss'

function AudioTTS({title, text, onTTSEnded, className}) {
  const
    {addModal, rmModal} = useModal(),
    [isGenerate, setIsGenerate] = useState(false),
    onGenerate = useCallback(
      (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (isGenerate) {
          return
        }
        if (!text) {
          return addModal((key) => {
            const modal = <ModalDialogAlertLocale key={key}
                                                  title="tts-empty-text"
                                                  message="tts-empty-text-details"
                                                  onClose={() => rmModal(modal)}/>
            return modal
          })
        }

        setIsGenerate(true)
        addModal((key) => {
          const modal = <ModalElectronTaskVisualizer key={key}
                                                     taskName="piper-convert"
                                                     dataSent={[text]}
                                                     onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [addModal, isGenerate, rmModal, text]
    )

  useElectronListener(
    'piper-convert-succeed',
    (filePath) => {
      typeof onTTSEnded == 'function' && onTTSEnded(filePath)
      setIsGenerate(false)
    },
    [onTTSEnded]
  )

  return isGenerate ?
    <ButtonIconRobot className={[styles.active, className].join(' ')} title={title} onClick={onGenerate}/> :
    <ButtonIconRobot className={className} title={title} onClick={onGenerate}/>
}

export default AudioTTS