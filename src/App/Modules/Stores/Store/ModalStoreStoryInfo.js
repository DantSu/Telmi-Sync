import { useLocale } from '../../../Components/Locale/LocaleHooks.js'
import ModalLayoutPadded from '../../../Components/Modal/ModalLayoutPadded.js'
import ButtonsContainer from '../../../Components/Buttons/ButtonsContainer.js'
import ModalTitle from '../../../Components/Modal/ModalTitle.js'
import ModalContent from '../../../Components/Modal/ModalContent.js'
import ButtonIconTextXMark from '../../../Components/Buttons/IconsTexts/ButtonIconTextXMark.js'

import styles from './Store.module.scss'

function ModalStoreStoryInfo ({story, onClose}) {
  const {getLocale} = useLocale()

  return <ModalLayoutPadded isClosable={true}
                            onClose={onClose}>
    <ModalTitle className={styles.infoTitle}>{story.title}</ModalTitle>
    <ModalContent>
      <dl className={styles.infoContainer}>
        <dt className={styles.infoLabel}>{getLocale('age')}</dt>
        <dd className={styles.infoContent}>{story.age}+</dd>

        <dt className={styles.infoLabel}>{getLocale('awards')}</dt>
        <dd className={styles.infoContent}>{story.awards.join(' | ')}</dd>

        <dt className={styles.infoLabel}>{getLocale('created-at')}</dt>
        <dd className={styles.infoContent}>{(new Date(story.created_at)).toLocaleString()}</dd>

        <dt className={styles.infoLabel}>{getLocale('updated-at')}</dt>
        <dd className={styles.infoContent}>{(new Date(story.updated_at)).toLocaleString()}</dd>

        <dt className={styles.infoLabelFullWidth}>{getLocale('description')}</dt>
        <dd className={styles.infoContentFullWidth}>{story.description}</dd>
      </dl>
    </ModalContent>
    <ButtonsContainer>
      <ButtonIconTextXMark text={getLocale('close')}
                           rounded={true}
                           onClick={onClose}/>
    </ButtonsContainer>
  </ModalLayoutPadded>
}

export default ModalStoreStoryInfo
