import { useRef } from 'react'
import { useLocale } from '../../../Components/Locale/LocaleHooks.js'
import ModalLayoutPadded from '../../../Components/Modal/ModalLayoutPadded.js'
import ButtonsContainer from '../../../Components/Buttons/ButtonsContainer.js'
import ButtonIconTextCheck from '../../../Components/Buttons/IconsTexts/ButtonIconTextCheck.js'
import InputText from '../../../Components/Form/Input/InputText.js'
import ModalTitle from '../../../Components/Modal/ModalTitle.js'
import ModalContent from '../../../Components/Modal/ModalContent.js'
import Form from '../../../Components/Form/Form.js'

function ModalStoryFormUpdate ({stories, onValidate, onClose}) {
  const
    {getLocale} = useLocale(),
    inputAgeRef = useRef(),
    inputCategoryRef = useRef()

  return <ModalLayoutPadded isClosable={true}
                            onClose={onClose}>
    <ModalTitle>{getLocale('stories-edit')} :</ModalTitle>
    <Form>{
      (validation) => {
        return <>
          <ModalContent>
            <InputText label={getLocale('age')}
                       key="story-age"
                       id="story-age"
                       type="number"
                       step="1"
                       min="0"
                       max="99"
                       defaultValue={stories[0].age || 0}
                       required={false}
                       ref={inputAgeRef}/>
            <InputText label={getLocale('category')}
                       key="story-category"
                       id="story-category"
                       defaultValue={stories[0].category || ''}
                       required={false}
                       ref={inputCategoryRef}/>
          </ModalContent>
          <ButtonsContainer>
            <ButtonIconTextCheck text={getLocale('save')}
                                 rounded={true}
                                 onClick={() => {
                                   validation(
                                     [
                                       inputAgeRef,
                                       inputCategoryRef
                                     ],
                                     (values) => {
                                       onValidate(stories.map(
                                         (story) => ({
                                           ...story,
                                           age: values[0],
                                           category: values[1]
                                         })
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

export default ModalStoryFormUpdate
