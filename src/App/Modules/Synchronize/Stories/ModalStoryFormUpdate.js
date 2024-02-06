import { useRef } from 'react'
import ModalLayoutPadded from '../../../Components/Modal/ModalLayoutPadded.js'
import ButtonsContainer from '../../../Components/Buttons/ButtonsContainer.js'
import ButtonIconTextCheck from '../../../Components/Buttons/IconsTexts/ButtonIconTextCheck.js'
import InputText from '../../../Components/Form/Input/InputText.js'
import ModalTitle from '../../../Components/Modal/ModalTitle.js'
import ModalContent from '../../../Components/Modal/ModalContent.js'
import Form from '../../../Components/Form/Form.js'

function ModalStoryFormUpdate ({story, onValidate, onClose}) {
  const inputRef = useRef()
  return <ModalLayoutPadded isClosable={true}
                            onClose={onClose}>
    <ModalTitle>Editer l'histoire :</ModalTitle>
    <Form>{
      (validation) => {
        return <>
          <ModalContent>
            <InputText label="Titre"
                       defaultValue={story.title}
                       required={true}
                       ref={inputRef}/>
          </ModalContent>
          <ButtonsContainer>
            <ButtonIconTextCheck text="Enregistrer"
                                 rounded={true}
                                 onClick={() => {
                                   validation(
                                     [inputRef],
                                     (values) => {
                                       onValidate({...story, title: values[0]})
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
