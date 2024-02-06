import ModalLayoutPadded from '../../ModalLayoutPadded.js'
import ButtonsContainer from '../../../Buttons/ButtonsContainer.js'
import ButtonIconTextXMark from '../../../Buttons/IconsTexts/ButtonIconTextXMark.js'

import styles from './ModalConfirmAction.module.scss'
import ModalTitle from '../../ModalTitle.js'
import ModalContent from '../../ModalContent.js'

function ModalDialogAlert ({title, message, onClose}) {
  return <ModalLayoutPadded className={styles.container}
                            isClosable={true}
                            onClose={onClose}>
    <ModalTitle>{title}</ModalTitle>
    <ModalContent><p>{message}</p></ModalContent>
    <ButtonsContainer>
      <ButtonIconTextXMark text="Fermer"
                           rounded={true}
                           onClick={onClose}/>
    </ButtonsContainer>
  </ModalLayoutPadded>
}

export default ModalDialogAlert
