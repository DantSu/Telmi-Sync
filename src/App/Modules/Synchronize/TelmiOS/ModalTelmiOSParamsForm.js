import { useRef } from 'react'
import { useLocale } from '../../../Components/Locale/LocaleHooks.js'
import ModalLayoutPadded from '../../../Components/Modal/ModalLayoutPadded.js'
import ButtonsContainer from '../../../Components/Buttons/ButtonsContainer.js'
import ButtonIconTextCheck from '../../../Components/Buttons/IconsTexts/ButtonIconTextCheck.js'
import InputRange from '../../../Components/Form/Input/InputRange.js'
import InputCheckbox from "../../../Components/Form/Input/InputSwitch.js";
import InputSelect from '../../../Components/Form/Input/InputSelect.js'
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
    inputRef6 = useRef(),
    inputRef7 = useRef(),
    inputRef8 = useRef(),
    inputRef9 = useRef(),
    inputRef10 = useRef(),
    inputRef11 = useRef()
  return <ModalLayoutPadded isClosable={true}
                            onClose={onClose}>
    <ModalTitle>{getLocale('telmios-parameters')} :</ModalTitle>
    <Form>{
      (validation) => {
        return <>
          <ModalContent>
            <InputRange label={getLocale('audio-volume-startup')}
                        key="audio-volume-startup"
                        id="audio-volume-startup"
                        defaultValue={parameters.audioVolumeStartup * 100}
                        min={0}
                        max={100}
                        step={1}
                        unit="%"
                        ref={inputRef0}/>
            <InputRange label={getLocale('audio-volume-max')}
                        key="audio-volume-max"
                        id="audio-volume-max"
                        defaultValue={parameters.audioVolumeMax * 100}
                        min={0}
                        max={100}
                        step={1}
                        unit="%"
                        ref={inputRef1}/>
            <InputRange label={getLocale('screen-brightness-startup')}
                        key="screen-brightness-startup"
                        id="screen-brightness-startup"
                        defaultValue={parameters.screenBrightnessStartup * 100}
                        min={0}
                        max={100}
                        step={1}
                        unit="%"
                        ref={inputRef2}/>
            <InputRange label={getLocale('screen-brightness-max')}
                        key="screen-brightness-max"
                        id="screen-brightness-max"
                        defaultValue={parameters.screenBrightnessMax * 100}
                        min={0}
                        max={100}
                        step={1}
                        unit="%"
                        ref={inputRef3}/>
            <InputRange label={getLocale('screen-on-inactivity-time')}
                        key="screen-on-inactivity-time"
                        id="screen-on-inactivity-time"
                        defaultValue={parameters.screenOnInactivityTime / 60}
                        min={1}
                        max={10}
                        step={0.5}
                        unit="minutes"
                        required={true}
                        ref={inputRef4}/>
            <InputRange label={getLocale('screen-off-inactivity-time')}
                        key="screen-off-inactivity-time"
                        id="screen-off-inactivity-time"
                        defaultValue={parameters.screenOffInactivityTime / 60}
                        min={1}
                        max={10}
                        step={0.5}
                        unit="minutes"
                        required={true}
                        ref={inputRef5}/>
            <InputRange label={getLocale('music-inactivity-time')}
                        key="music-inactivity-time"
                        id="music-inactivity-time"
                        defaultValue={parameters.musicInactivityTime / 3600}
                        min={0.1}
                        max={3}
                        step={0.1}
                        unit={getLocale('hours')}
                        required={true}
                        ref={inputRef6}/>
            <InputCheckbox label={getLocale('story-display-tiles')}
                        key="story-display-tiles"
                        id="story-display-tiles"
                        defaultValue={parameters.storyDisplayTiles}
                        ref={inputRef7}/>
            <InputCheckbox label={getLocale('story-enable-night-mode')}
                        key="story-enable-night-mode"
                        id="story-enable-night-mode"
                        defaultValue={!parameters.storyDisableNightMode}
                        ref={inputRef8}/>
            <InputCheckbox label={getLocale('story-enable-timeline')}
                        key="story-enable-timeline"
                        id="story-enable-timeline"
                        defaultValue={!parameters.storyDisableTimeline}
                        ref={inputRef9}/>
            <InputCheckbox label={getLocale('music-enable-repeat-modes')}
                        key="music-enable-repeat-mode"
                        id="music-enable-repeat-mode"
                        defaultValue={!parameters.musicDisableRepeatModes}
                        ref={inputRef10}/>
            <InputSelect label={getLocale('change-boot-splashscreen')}
                         key="boot-splashscreen"
                         id="boot-splashscreen"
                         defaultValue={parameters.bootSplashscreen}
                         options={[
                           {value:'', text: getLocale('do-nothing')},
                           {value:'telmi', text: getLocale('put-telmi-picture')},
                           {value:'original', text: getLocale('restore-original-picture')}
                         ]}
                         ref={inputRef11}/>
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
                                       inputRef6,
                                       inputRef7,
                                       inputRef8,
                                       inputRef9,
                                       inputRef10,
                                       inputRef11
                                     ],
                                     (values) => {
                                       onValidate({
                                         ...parameters,
                                         audioVolumeStartup: values[0] / 100,
                                         audioVolumeMax: values[1] / 100,
                                         screenBrightnessStartup: values[2] / 100,
                                         screenBrightnessMax: values[3] / 100,
                                         screenOnInactivityTime: values[4] * 60,
                                         screenOffInactivityTime: values[5] * 60,
                                         musicInactivityTime: values[6] * 3600,
                                         storyDisplayTiles: values[7],
                                         storyDisableNightMode: !values[8],
                                         storyDisableTimeline: !values[9],
                                         musicDisableRepeatModes: !values[10],
                                         bootSplashscreen: values[11]
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
