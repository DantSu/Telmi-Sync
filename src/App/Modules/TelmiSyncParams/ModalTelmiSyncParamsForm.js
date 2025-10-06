import {useEffect, useRef, useState} from 'react'
import {useLocale} from '../../Components/Locale/LocaleHooks.js'
import {useTelmiSyncParams} from '../../Components/TelmiSyncParams/TelmiSyncParamsHooks.js'
import {useElectronEmitter, useElectronListener} from '../../Components/Electron/Hooks/UseElectronEvent.js'
import ModalLayoutPadded from '../../Components/Modal/ModalLayoutPadded.js'
import ButtonsContainer from '../../Components/Buttons/ButtonsContainer.js'
import ButtonIconTextCheck from '../../Components/Buttons/IconsTexts/ButtonIconTextCheck.js'
import InputSelect from '../../Components/Form/Input/InputSelect.js'
import ModalTitle from '../../Components/Modal/ModalTitle.js'
import ModalContent from '../../Components/Modal/ModalContent.js'
import Form from '../../Components/Form/Form.js'

function ModalTelmiSyncParamsForm({onClose}) {
  const
    {getLocale} = useLocale(),
    {params, saveParams} = useTelmiSyncParams(),
    [audioDevices, setAudioDevices] = useState([]),
    [appVersion, setAppVersion] = useState(''),
    inputRef0 = useRef(),
    inputRef1 = useRef()

  useEffect(
    () => {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          setAudioDevices(
            devices
              .filter((v) => v.kind === 'audioinput')
              .map((v) => ({value: v.deviceId, text: v.label}))
          )
        })
    },
    []
  )

  useElectronEmitter('app-version-get', [])
  useElectronListener('app-version', (data) => setAppVersion(' v' + data), [])

  return <ModalLayoutPadded isClosable={true}
                            onClose={onClose}>
    <ModalTitle>{getLocale('telmi-sync-parameters', appVersion)} :</ModalTitle>
    <Form>{
      (validation) => {
        return <>
          <ModalContent>
            <InputSelect label={getLocale('audio-microphone-select')}
                         key="audio-microphone-select"
                         id="audio-microphone-select"
                         defaultValue={params.microphone}
                         options={audioDevices}
                         ref={inputRef0}/>
            <InputSelect label={getLocale('audio-piper-voice')}
                         key="audio-piper-voice"
                         id="audio-piper-voice"
                         defaultValue={params.piper.voice + '/' + params.piper.speaker}
                         options={[
                           {value: 'fr_FR-beatrice/0', text: 'Béatrice'},
                           {value: 'fr_FR-dantsu/0', text: 'DantSu'},
                         ]}
                         ref={inputRef1}/>
          </ModalContent>
          <ButtonsContainer>
            <ButtonIconTextCheck text={getLocale('save')}
                                 rounded={true}
                                 onClick={() => {
                                   validation(
                                     [
                                       inputRef0,
                                       inputRef1,
                                     ],
                                     (values) => {
                                       const piper = values[1].split('/')
                                       saveParams(Object.assign(
                                         {...params, piper: {voice: piper[0], speaker: piper[1]}},
                                         values[0] !== undefined ? {microphone: values[0]} : null
                                       ))
                                       onClose()
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
