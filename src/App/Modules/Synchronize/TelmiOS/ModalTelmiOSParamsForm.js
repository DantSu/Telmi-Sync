import { useRef } from 'react'
import { useLocale } from '../../../Components/Locale/LocaleHooks.js'
import ModalLayoutPadded from '../../../Components/Modal/ModalLayoutPadded.js'
import ButtonsContainer from '../../../Components/Buttons/ButtonsContainer.js'
import ButtonIconTextCheck from '../../../Components/Buttons/IconsTexts/ButtonIconTextCheck.js'
import InputRange from '../../../Components/Form/Input/InputRange.js'
import ModalTitle from '../../../Components/Modal/ModalTitle.js'
import ModalContent from '../../../Components/Modal/ModalContent.js'
import Form from '../../../Components/Form/Form.js'

function ModalTelmiOSParamsForm ({parameters, onValidate, onClose}) {
  const
    {getLocale} = useLocale(),
    inputRef0 = useRef(),
    inputRef1 = useRef(),
    inputRef2 = useRef(),
    inputRef3 = useRef(),
    inputRef4 = useRef(),
    inputRef5 = useRef(),
    inputRef6 = useRef()
  return <ModalLayoutPadded isClosable={true}
                            onClose={onClose}>
    <ModalTitle>{getLocale('telmios-parameters')} :</ModalTitle>
    <Form>{
      (validation) => {
        return <>
          <ModalContent>
            <InputRange label={getLocale('audio-level-startup')}
                        defaultValue={parameters.audioLevelStartup * 100}
                        min={0}
                        max={100}
                        step={1}
                        unit="%"
                        ref={inputRef0}/>
            <InputRange label={getLocale('audio-level-max')}
                        defaultValue={parameters.audioLevelMax * 100}
                        min={0}
                        max={100}
                        step={1}
                        unit="%"
                        ref={inputRef1}/>
            <InputRange label={getLocale('screen-luminosity-startup')}
                        defaultValue={parameters.screenLuminosityStartup * 100}
                        min={0}
                        max={100}
                        step={1}
                        unit="%"
                        ref={inputRef2}/>
            <InputRange label={getLocale('screen-luminosity-max')}
                        defaultValue={parameters.screenLuminosityMax * 100}
                        min={0}
                        max={100}
                        step={1}
                        unit="%"
                        ref={inputRef3}/>
            <InputRange label={getLocale('screen-on-inactivity-time')}
                        defaultValue={parameters.screenOnInactivityTime / 60}
                        min={1}
                        max={10}
                        step={0.5}
                        unit="minutes"
                        required={true}
                        ref={inputRef4}/>
            <InputRange label={getLocale('screen-off-inactivity-time')}
                        defaultValue={parameters.screenOffInactivityTime / 60}
                        min={1}
                        max={10}
                        step={0.5}
                        unit="minutes"
                        required={true}
                        ref={inputRef5}/>
            <InputRange label={getLocale('mp3player-inactivity-tracks')}
                        defaultValue={parameters.mp3PlayerInactivityTracks}
                        min={1}
                        max={15}
                        step={1}
                        unit={getLocale('musics')}
                        required={true}
                        ref={inputRef6}/>
          </ModalContent>
          <ButtonsContainer>
            <ButtonIconTextCheck text={getLocale('save')}
                                 rounded={true}
                                 onClick={() => {
                                   validation(
                                     [
                                       inputRef0,
                                       inputRef1,
                                       inputRef2,
                                       inputRef3,
                                       inputRef4,
                                       inputRef5,
                                       inputRef6
                                     ],
                                     (values) => {
                                       onValidate({
                                         ...parameters,
                                         audioLevelStartup: values[0] / 100,
                                         audioLevelMax: values[1] / 100,
                                         screenLuminosityStartup: values[2] / 100,
                                         screenLuminosityMax: values[3] / 100,
                                         screenOnInactivityTime: values[4] * 60,
                                         screenOffInactivityTime: values[5] * 60,
                                         mp3PlayerInactivityTracks: values[6]
                                       })
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

export default ModalTelmiOSParamsForm
