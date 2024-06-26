import { useRef } from 'react'
import { useLocale } from '../../../Components/Locale/LocaleHooks.js'
import ModalLayoutPadded from '../../../Components/Modal/ModalLayoutPadded.js'
import ButtonsContainer from '../../../Components/Buttons/ButtonsContainer.js'
import ButtonIconTextCheck from '../../../Components/Buttons/IconsTexts/ButtonIconTextCheck.js'
import InputText from '../../../Components/Form/Input/InputText.js'
import ModalTitle from '../../../Components/Modal/ModalTitle.js'
import ModalContent from '../../../Components/Modal/ModalContent.js'
import Form from '../../../Components/Form/Form.js'

function ModalStoryFormUpdate ({story, onValidate, onClose}) {
  const
    {getLocale} = useLocale(),
    inputTitleRef = useRef(),
    inputAgeRef = useRef(),
    inputCategoryRef = useRef()

  return <ModalLayoutPadded isClosable={true}
                            onClose={onClose}>
    <ModalTitle>{getLocale('story-edit')} :</ModalTitle>
    <Form>{
      (validation) => {
        return <>
          <ModalContent>
            <InputText label={getLocale('title')}
                       key="story-title"
                       id="story-title"
                       defaultValue={story.title}
                       required={true}
                       ref={inputTitleRef}/>
            <InputText label={getLocale('age')}
                       key="story-age"
                       id="story-age"
                       type="number"
                       step="1"
                       min="0"
                       max="99"
                       defaultValue={story.age || 0}
                       required={false}
                       ref={inputAgeRef}/>
            <InputText label={getLocale('category')}
                       key="story-category"
                       id="story-category"
                       defaultValue={story.category || ''}
                       required={false}
                       ref={inputCategoryRef}/>
          </ModalContent>
          <ButtonsContainer>
            <ButtonIconTextCheck text={getLocale('save')}
                                 rounded={true}
                                 onClick={() => {
                                   validation(
                                     [
                                       inputTitleRef,
                                       inputAgeRef,
                                       inputCategoryRef
                                     ],
                                     (values) => {
                                       onValidate({
                                         ...story,
                                         title: values[0],
                                         age: values[1],
                                         category: values[2]
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

export default ModalStoryFormUpdate
