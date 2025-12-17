import {useRef, useState} from 'react'
import {useLocale} from '../../Locale/LocaleHooks.js'
import {useElectronEmitter, useElectronListener} from '../../Electron/Hooks/UseElectronEvent.js'
import {useModal} from '../../Modal/ModalHooks.js'
import ModalLayoutPadded from '../../Modal/ModalLayoutPadded.js'
import ButtonsContainer from '../../Buttons/ButtonsContainer.js'
import ButtonIconTextCheck from '../../Buttons/IconsTexts/ButtonIconTextCheck.js'
import ModalTitle from '../../Modal/ModalTitle.js'
import ModalContent from '../../Modal/ModalContent.js'
import Form from '../../Form/Form.js'
import InputText from '../../Form/Input/InputText.js'
import ModalElectronTaskVisualizer from '../../Electron/Modal/ModalElectronTaskVisualizer.js'

function ModalTelmiSyncParamsForm({onClose, mp3Path}) {
  const
    {getLocale} = useLocale(),
    {addModal, rmModal} = useModal(),
    [audioAmplificationDefault, setAudioAmplificationDefault] = useState(null),
    inputRef0 = useRef()

  useElectronEmitter('audio-amplification-default-get', [mp3Path])
  useElectronListener('audio-amplification-default', (data) => setAudioAmplificationDefault(data), [])
  useElectronListener('audio-amplification-data', (newMp3Path) => onClose(newMp3Path), [])

  return <ModalLayoutPadded isClosable={true}
                            onClose={onClose}>
    <ModalTitle>{getLocale('audio-amplify')} :</ModalTitle>
    <Form>{
      (validation) => {
        return <>
          <ModalContent> {
            audioAmplificationDefault !== null && <InputText label={getLocale('audio-amplification-value')}
                                                             key="audio-amplification"
                                                             id="audio-amplification"
                                                             type="number"
                                                             defaultValue={audioAmplificationDefault}
                                                             ref={inputRef0}/>
          }
          </ModalContent>
          <ButtonsContainer>
            <ButtonIconTextCheck text={getLocale('apply')}
                                 rounded={true}
                                 onClick={() => {
                                   validation(
                                     [inputRef0],
                                     (values) => {
                                       addModal((key) => {
                                         const modal = <ModalElectronTaskVisualizer key={key}
                                                                                    taskName="audio-amplification"
                                                                                    dataSent={[mp3Path, values[0]]}
                                                                                    onClose={() => rmModal(modal)}/>
                                         return modal
                                       })
                                     }
                                   )
                                 }}/>
          </ButtonsContainer>
        </>
      }
    }</Form>
  </ModalLayoutPadded>
}

export default ModalTelmiSyncParamsForm
