import {useEffect, useMemo, useRef} from 'react'
import {useLocale} from '../../../Components/Locale/LocaleHooks.js'

import ModalLayoutPadded from '../../../Components/Modal/ModalLayoutPadded.js'
import ModalTitle from '../../../Components/Modal/ModalTitle.js'
import Form from '../../../Components/Form/Form.js'
import ModalContent from '../../../Components/Modal/ModalContent.js'
import InputText from '../../../Components/Form/Input/InputText.js'
import ButtonsContainer from '../../../Components/Buttons/ButtonsContainer.js'
import ButtonIconTextCheck from '../../../Components/Buttons/IconsTexts/ButtonIconTextCheck.js'


function ModalSearchStage({story, onValidate, onClose}) {
  const
    {getLocale} = useLocale(),
    searchRef = useRef(),
    stageList = useMemo(
      () => Object.keys(story.notes).reduce(
        (acc, v) => ({
          ...acc,
          [story.notes[v].title]: v
        }),
        {}
      ),
      [story.notes]
    )

  useEffect(() => {searchRef.current.focus()}, [])

  return <ModalLayoutPadded isClosable={true}
                            onClose={onClose}>
    <ModalTitle>{getLocale('center-on')} :</ModalTitle>
    <Form>{
      (validation) => {
        return <>
          <ModalContent>
            <InputText label={getLocale('studio-scene')}
                       key="stage-search"
                       id="stage-search"
                       options={Object.keys(stageList)}
                       required={true}
                       ref={searchRef}/>
          </ModalContent>
          <ButtonsContainer>
            <ButtonIconTextCheck text={getLocale('validate')}
                                 rounded={true}
                                 onClick={() => {
                                   validation(
                                     [searchRef],
                                     (values) => {
                                       onValidate(stageList[values[0]] || values[0])
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

export default ModalSearchStage