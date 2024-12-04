import { useLocale } from '../../../Components/Locale/LocaleHooks.js'
import {stripHtmlTags} from '../../../Helpers/String.js'
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

        <dt className={styles.infoLabel}>{getLocale('category')}</dt>
        <dd className={styles.infoContent}>{story.category}</dd>

        <dt className={styles.infoLabel}>{getLocale('author')}</dt>
        <dd className={styles.infoContent}>{story.author}</dd>

        <dt className={styles.infoLabel}>{getLocale('voice')}</dt>
        <dd className={styles.infoContent}>{story.voice}</dd>

        <dt className={styles.infoLabel}>{getLocale('designer')}</dt>
        <dd className={styles.infoContent}>{story.designer}</dd>

        <dt className={styles.infoLabel}>{getLocale('publisher')}</dt>
        <dd className={styles.infoContent}>{story.publisher}</dd>

        <dt className={styles.infoLabel}>{getLocale('download-count')}</dt>
        <dd className={styles.infoContent}>{story.download_count}</dd>

        <dt className={styles.infoLabel}>{getLocale('updated-at')}</dt>
        <dd className={styles.infoContent}>{(new Date(story.updated_at)).toLocaleString()}</dd>

        <dt className={styles.infoLabelFullWidth}>{getLocale('description')}</dt>
        <dd className={styles.infoContentFullWidth}>{stripHtmlTags(story.description)}</dd>
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
