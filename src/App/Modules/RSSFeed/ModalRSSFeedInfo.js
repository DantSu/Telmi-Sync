import {useCallback, useState} from 'react'
import {useLocale} from '../../Components/Locale/LocaleHooks.js'
import {useElectronEmitter, useElectronListener} from '../../Components/Electron/Hooks/UseElectronEvent.js'
import ModalLayoutPadded from '../../Components/Modal/ModalLayoutPadded.js'
import ModalTitle from '../../Components/Modal/ModalTitle.js'
import ModalContent from '../../Components/Modal/ModalContent.js'
import ButtonsContainer from '../../Components/Buttons/ButtonsContainer.js'
import ButtonIconTextStore from '../../Components/Buttons/IconsTexts/ButtonIconTextStore.js'
import ButtonIconTextLinkOut from '../../Components/Buttons/IconsTexts/ButtonIconTextLinkOut.js'
import Loader from '../../Components/Loader/Loader.js'
import RSSFeedStars from './RSSFeedStars.js'
import RSSFeedRatingSummary from './RSSFeedRatingSummary.js'
import RSSFeedAgeSummary from './RSSFeedAgeSummary.js'
import RSSFeedReviewsList from './RSSFeedReviewsList.js'
import ButtonExternalLink from '../../Components/Link/ButtonExternalLink.js'
import styles from './RSSFeed.module.scss'

const {ipcRenderer} = window.require('electron')

function ModalRSSFeedInfo({rssFeed, onClose}) {
  const
    {getLocale} = useLocale(),
    [details, setDetails] = useState(null),
    [error, setError] = useState(false),
    onAddToStores = useCallback(
      () => {
        ipcRenderer.send('store-add', {name: rssFeed.title, url: rssFeed.rssFeed, deletable: true})
        onClose()
      },
      [onClose, rssFeed]
    )

  useElectronListener(
    'store-rssfeed-details-data',
    (data) => {
      if (data.dataUrl === rssFeed.dataUrl) {
        setDetails(data)
        setError(false)
      }
    },
    [rssFeed.dataUrl]
  )
  useElectronListener(
    'store-rssfeed-details-error',
    (dataUrl) => {
      if (dataUrl === rssFeed.dataUrl) {
        setDetails(null)
        setError(true)
      }
    },
    [rssFeed.dataUrl]
  )
  useElectronEmitter('store-rssfeed-details-get', [rssFeed.dataUrl])

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
          {rssFeed.averageRating !== null && (
            <>
              <dt className={styles.infoLabel}>{getLocale('average-rating')} :</dt>
              <dd className={styles.infoContent}>
                <RSSFeedStars count={rssFeed.averageRating}/>
                <span className={styles.statsRatingValue}> {rssFeed.averageRating}</span>
                <span className={styles.statsRatingCount}> ({rssFeed.reviewsCount} {getLocale('reviews-count')})</span>
              </dd>
            </>
          )}
          {rssFeed.recommendedAge !== null && (
            <>
              <dt className={styles.infoLabel}>{getLocale('recommended-age')} :</dt>
              <dd className={styles.infoContent}>{rssFeed.recommendedAge}+</dd>
            </>
          )}
          {details && details.category !== null && details.category !== undefined && (
            <>
              <dt className={[styles.infoLabel].join(' ')}>{getLocale('category')} :</dt>
              <dd className={[styles.infoContent].join(' ')}>{details.category}</dd>
            </>
          )}
          <dt className={styles.infoLabel}>{getLocale('advertising-presence')} :</dt>
          <dd className={styles.infoContent}>{getLocale(rssFeed.ads ? 'yes' : 'no')}</dd>
          <dt className={[styles.infoLabel, styles.infoFullWidth].join(' ')}>{getLocale('description')} :</dt>
          <dd className={[styles.infoContent, styles.infoFullWidth].join(' ')}>{rssFeed.description}</dd>

        </dl>
      </div>
      <div className={styles.statsContainer}>
        {rssFeed.reviewsCount === 0 ? (
          <p>{getLocale('no-reviews')}</p>
        ) : error ? (
          <p>{getLocale('load-reviews-error')}</p>
        ) : details === null ? (
          <Loader/>
        ) : (
          <>
            <div className={styles.statsSummaries}>
              <RSSFeedRatingSummary reviews={details.reviews}/>
              <RSSFeedAgeSummary reviews={details.reviews}/>
            </div>
            <RSSFeedReviewsList reviews={details.reviews}/>
          </>
        )}
      </div>
    </ModalContent>
    <ButtonsContainer>
      {
        rssFeed.link !== '' &&
        <ButtonExternalLink href={rssFeed.link}>
          <ButtonIconTextLinkOut text={getLocale('visit-website')}
                                 rounded={true}/>
        </ButtonExternalLink>
      }
      <ButtonIconTextStore text={getLocale('add-rssfeed-to-store')}
                           rounded={true}
                           onClick={onAddToStores}/>
    </ButtonsContainer>
  </ModalLayoutPadded>
}

export default ModalRSSFeedInfo
