import {useCallback} from 'react'
import {useLocale} from '../../Components/Locale/LocaleHooks.js'
import ModalLayoutPadded from '../../Components/Modal/ModalLayoutPadded.js'
import ModalTitle from '../../Components/Modal/ModalTitle.js'
import ModalContent from '../../Components/Modal/ModalContent.js'
import ButtonsContainer from '../../Components/Buttons/ButtonsContainer.js'
import ButtonIconTextStore from '../../Components/Buttons/IconsTexts/ButtonIconTextStore.js'
import ButtonIconTextLinkOut from '../../Components/Buttons/IconsTexts/ButtonIconTextLinkOut.js'

import styles from './RSSFeed.module.scss'
import ButtonExternalLink from '../../Components/Link/ButtonExternalLink.js'

const {ipcRenderer} = window.require('electron')

function ModalRSSFeedInfo({rssFeed, onClose}) {
  const
    {getLocale} = useLocale(),
    onVisitWebsite = useCallback(
      () => {

      },
      []
    ),
    onAddToStores = useCallback(
      () => {
        ipcRenderer.send('store-add', {name: rssFeed.title, url: rssFeed.rssFeed, deletable: true})
        onClose()
      },
      [onClose, rssFeed]
    )

  return <ModalLayoutPadded isClosable={true}
                            onClose={onClose}>
    <ModalTitle className={styles.infoTitle}
                title={rssFeed.category + ' - ' + rssFeed.title}>
      {rssFeed.category} - {rssFeed.title}
    </ModalTitle>
    <ModalContent>
      <div className={styles.infoContainer}>
        <img src={rssFeed.image} alt="" className={styles.infoImage}/>
        <dl className={styles.infoDescription}>
          <dt className={styles.infoLabel}>{getLocale('description')}</dt>
          <dd className={styles.infoContent}>{rssFeed.description}</dd>
        </dl>
      </div>
    </ModalContent>
    <ButtonsContainer>
      {
        rssFeed.link !== '' &&
        <ButtonExternalLink href={rssFeed.link}>
          <ButtonIconTextLinkOut text={getLocale('visit-website')}
                                 rounded={true}
                                 onClick={onVisitWebsite}/>
        </ButtonExternalLink>
      }
      <ButtonIconTextStore text={getLocale('add-rssfeed-to-store')}
                           rounded={true}
                           onClick={onAddToStores}/>
    </ButtonsContainer>
  </ModalLayoutPadded>
}

export default ModalRSSFeedInfo