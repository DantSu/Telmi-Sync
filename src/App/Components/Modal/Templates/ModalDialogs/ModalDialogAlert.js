import { useLocale } from '../../../Locale/LocaleHooks.js'
import ModalLayoutPadded from '../../ModalLayoutPadded.js'
import ButtonsContainer from '../../../Buttons/ButtonsContainer.js'
import ButtonIconTextXMark from '../../../Buttons/IconsTexts/ButtonIconTextXMark.js'
import ModalTitle from '../../ModalTitle.js'
import ModalContent from '../../ModalContent.js'

import styles from './ModalConfirmAction.module.scss'

function ModalDialogAlert ({title, message, onClose}) {

  const {getLocale} = useLocale()

  return <ModalLayoutPadded className={styles.container}
                            isClosable={true}
                            onClose={onClose}>
    <ModalTitle>{title}</ModalTitle>
    <ModalContent><p dangerouslySetInnerHTML={{__html: message}}/></ModalContent>
    <ButtonsContainer>
      <ButtonIconTextXMark text={getLocale('close')}
                           rounded={true}
                           onClick={onClose}/>
    </ButtonsContainer>
  </ModalLayoutPadded>
}

export default ModalDialogAlert
