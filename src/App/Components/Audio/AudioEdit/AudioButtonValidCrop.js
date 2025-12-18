import {useModal} from '../../Modal/ModalHooks.js'
import {useElectronListener} from '../../Electron/Hooks/UseElectronEvent.js'
import {useLocale} from '../../Locale/LocaleHooks.js'
import ButtonIconCheck from '../../Buttons/Icons/ButtonIconCheck.js'
import ModalElectronTaskVisualizer from '../../Electron/Modal/ModalElectronTaskVisualizer.js'

import styles from './AudioEdit.module.scss'

function AudioButtonValidCrop({mp3Path, player, croppingData, setCroppingData, setNewMp3Path}) {
  const
    {getLocale} = useLocale(),
    {addModal, rmModal} = useModal()

  useElectronListener(
    'audio-crop-data',
    (oldMp3Path, newMp3Path) => {
      if(mp3Path !== oldMp3Path) {
        return
      }
      if (newMp3Path !== null) {
        setNewMp3Path(newMp3Path)
      }
      setCroppingData(null)
    },
    [setNewMp3Path, mp3Path]
  )

  return <ButtonIconCheck className={styles.button}
                          title={getLocale('audio-crop')}
                          onClick={() => {
                            if(croppingData.start > 0 || croppingData.end < player.audio.duration.toFixed(3)) {
                              addModal((key) => {
                                const modal = <ModalElectronTaskVisualizer key={key}
                                                                           taskName="audio-crop"
                                                                           dataSent={[mp3Path, croppingData.start, croppingData.end]}
                                                                           onClose={() => rmModal(modal)}/>
                                return modal
                              })
                            } else {
                              setCroppingData(null)
                            }
                          }}/>
}


export default AudioButtonValidCrop