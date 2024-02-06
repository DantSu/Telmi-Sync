import ModalLayoutPadded from '../../ModalLayoutPadded.js'
import ButtonsContainer from '../../../Buttons/ButtonsContainer.js'
import ButtonIconTextCheck from '../../../Buttons/IconsTexts/ButtonIconTextCheck.js'
import ButtonIconTextXMark from '../../../Buttons/IconsTexts/ButtonIconTextXMark.js'

import styles from './ModalConfirmAction.module.scss'
import ModalTitle from '../../ModalTitle.js'
import ModalContent from '../../ModalContent.js'

function ModalDialogConfirm ({title, message, onConfirm, onClose}) {
  return <ModalLayoutPadded className={styles.container}
                            isClosable={true}
                            onClose={onClose}>
    <ModalTitle>{title}</ModalTitle>
    <ModalContent><p>{message}</p></ModalContent>
    <ButtonsContainer>
      <ButtonIconTextXMark text="Annuler"
                           rounded={true}
                           onClick={onClose}/>
      <ButtonIconTextCheck text="Continuer"
                           rounded={true}
                           onClick={() => {
                             onConfirm()
                             onClose()
                           }}/>
    </ButtonsContainer>
  </ModalLayoutPadded>
}

export default ModalDialogConfirm
