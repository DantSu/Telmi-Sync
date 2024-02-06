import { useRef } from 'react'
import ModalLayoutPadded from '../../../Components/Modal/ModalLayoutPadded.js'
import ButtonsContainer from '../../../Components/Buttons/ButtonsContainer.js'
import ButtonIconTextCheck from '../../../Components/Buttons/IconsTexts/ButtonIconTextCheck.js'
import InputText from '../../../Components/Form/Input/InputText.js'
import ModalTitle from '../../../Components/Modal/ModalTitle.js'
import ModalContent from '../../../Components/Modal/ModalContent.js'
import Form from '../../../Components/Form/Form.js'

function ModalStoreFormAdd ({onValidate, onClose}) {
  const
    nameRef = useRef(),
    urlRef = useRef()

  return <ModalLayoutPadded isClosable={true}
                            onClose={onClose}>
    <ModalTitle>Ajouter un store :</ModalTitle>
    <Form>{
      (validation) => {
        return <>
          <ModalContent>
            <InputText label="Nom"
                       required={true}
                       ref={nameRef}/>
            <InputText label="URL"
                       type="url"
                       required={true}
                       ref={urlRef}/>
          </ModalContent>
          <ButtonsContainer>
            <ButtonIconTextCheck text="Enregistrer"
                                 rounded={true}
                                 onClick={() => {
                                   validation(
                                     [nameRef, urlRef],
                                     (values) => {
                                       onValidate({
                                         name: values[0],
                                         url: values[1],
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

export default ModalStoreFormAdd
