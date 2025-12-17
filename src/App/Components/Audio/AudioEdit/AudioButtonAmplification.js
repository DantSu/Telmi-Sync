import {useLocale} from '../../Locale/LocaleHooks.js'
import {useModal} from '../../Modal/ModalHooks.js'
import ButtonIconVolumeHigh from '../../Buttons/Icons/ButtonIconVolumeHigh.js'
import ModalAudioAmplification from './ModalAudioAmplification.js'

import styles from './AudioEdit.module.scss'

function AudioButtonAmplification({mp3Path, setNewMp3Path}) {
  const
    {getLocale} = useLocale(),
    {addModal, rmModal} = useModal()

  return <ButtonIconVolumeHigh className={styles.button}
                               title={getLocale('audio-amplify')}
                               onClick={() => {
                                 addModal((key) => {
                                   const modal = <ModalAudioAmplification key={key}
                                                                          mp3Path={mp3Path}
                                                                          onClose={(newMp3Path) => {
                                                                            typeof newMp3Path === 'string' && setNewMp3Path(newMp3Path)
                                                                            rmModal(modal)
                                                                          }}/>
                                   return modal
                                 })
                               }}/>
}

export default AudioButtonAmplification