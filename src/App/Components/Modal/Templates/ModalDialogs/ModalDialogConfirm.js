import { useLocale } from '../../../Locale/LocaleHooks.js'
import ModalLayoutPadded from '../../ModalLayoutPadded.js'
import ButtonsContainer from '../../../Buttons/ButtonsContainer.js'
import ButtonIconTextCheck from '../../../Buttons/IconsTexts/ButtonIconTextCheck.js'
import ButtonIconTextXMark from '../../../Buttons/IconsTexts/ButtonIconTextXMark.js'
import ModalTitle from '../../ModalTitle.js'
import ModalContent from '../../ModalContent.js'

import styles from './ModalConfirmAction.module.scss'

function ModalDialogConfirm ({title, message, onConfirm, onClose}) {
  const {getLocale} = useLocale()

  return <ModalLayoutPadded className={styles.container}
                            isClosable={true}
                            onClose={onClose}>
    <ModalTitle>{title}</ModalTitle>
    <ModalContent><p dangerouslySetInnerHTML={{__html: message}}/></ModalContent>
    <ButtonsContainer>
      <ButtonIconTextXMark text={getLocale('cancel')}
                           rounded={true}
                           onClick={onClose}/>
      <ButtonIconTextCheck text={getLocale('confirm')}
                           rounded={true}
                           onClick={() => {
                             onConfirm()
                             onClose()
                           }}/>
    </ButtonsContainer>
  </ModalLayoutPadded>
}

export default ModalDialogConfirm
