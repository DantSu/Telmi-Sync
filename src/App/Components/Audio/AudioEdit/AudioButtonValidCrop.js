import {useModal} from '../../Modal/ModalHooks.js'
import {useElectronListener} from '../../Electron/Hooks/UseElectronEvent.js'
import {useLocale} from '../../Locale/LocaleHooks.js'
import ModalElectronTaskVisualizer from '../../Electron/Modal/ModalElectronTaskVisualizer.js'
import ButtonIconXMark from '../../Buttons/Icons/ButtonIconXMark.js'

import styles from './AudioEdit.module.scss'

function AudioButtonValidCrop({mp3Path, player, croppingData, setCroppingData, setNewMp3Path}) {
  const
    {getLocale} = useLocale(),
    {addModal, rmModal} = useModal(),

    openModal = (functionName) => {
      if (croppingData.start > 0 || croppingData.end < player.audio.duration.toFixed(3)) {
        addModal((key) => {
          const modal = <ModalElectronTaskVisualizer key={key}
                                                     taskName="audio-edit-segment"
                                                     dataSent={[mp3Path, functionName, croppingData.start, croppingData.end]}
                                                     onClose={() => rmModal(modal)}/>
          return modal
        })
      } else {
        setCroppingData(null)
      }
    }

  useElectronListener(
    'audio-edit-segment-data',
    (oldMp3Path, newMp3Path) => {
      if (mp3Path !== oldMp3Path) {
        return
      }
      if (newMp3Path !== null) {
        setNewMp3Path(newMp3Path)
      }
      setCroppingData(null)
    },
    [setNewMp3Path, mp3Path]
  )

  return <div className={styles.cropContainer}>
    <ButtonIconXMark className={styles.button}
                     title={getLocale('audio-edit-segment')}
                     onClick={() => setCroppingData(null)}/>
    <ul className={styles.cropChoices}>
      <li onClick={() => openModal('audioRemoveSelectedTime')}>{getLocale('audio-delete-selected')}</li>
      <li onClick={() => openModal('audioRemoveUnselectedTime')}>{getLocale('audio-delete-unselected')}</li>
      <li onClick={() => openModal('audioMuteSelectedTime')}>{getLocale('audio-mute-selected')}</li>
      <li onClick={() => openModal('audioMuteUnselectedTime')}>{getLocale('audio-mute-unselected')}</li>
    </ul>
  </div>
}


export default AudioButtonValidCrop