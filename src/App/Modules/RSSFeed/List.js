import {useCallback, useMemo, useState} from 'react'
import {useLocale} from '../../Components/Locale/LocaleHooks.js'
import {useElectronEmitter, useElectronListener} from '../../Components/Electron/Hooks/UseElectronEvent.js'
import {useModal} from '../../Components/Modal/ModalHooks.js'
import Table from '../../Components/Table/Table.js'
import ModalRSSFeedInfo from './ModalRSSFeedInfo.js'
import TableHeaderIcon from '../../Components/Table/TableHeaderIcon.js'
import ButtonIconSort from '../../Components/Buttons/Icons/ButtonIconSort.js'
import Banner from '../../Components/Banner/Banner.js'
import imageBanner from '../../Assets/Images/banner-podcasts.jpg'

import styles from './RSSFeed.module.scss'

const
  CellImageTop = ({data}) => {
    if (data.averageRating == null) {
      return null
    }
    return <p className={styles.rateContainer}>
      <i className={styles.rateStar}></i> {data.averageRating} ({data.reviewsCount})
    </p>
  },

  flatRssFeeds = (rssFeeds, getLocale) => Object.keys(rssFeeds).reduce(
    (acc, key) => [
      ...acc,
      ...rssFeeds[key].map((rssFeed) => Object.assign(
        {
          ...rssFeed,
          sectionCategory: key,
          cellImageTop: CellImageTop,
          cellTitle: rssFeed.recommendedAge !== null ? `${rssFeed.recommendedAge}+] ${rssFeed.title}` : rssFeed.title,
          cellSubtitle: rssFeed.contentCategory,
          ageCategory: rssFeed.recommendedAge !== null ? getLocale('review-age', rssFeed.recommendedAge) : getLocale('unknow'),
          rateCategory: rssFeed.averageRating !== null ? getLocale('rated-higher', Math.floor(rssFeed.averageRating)) : getLocale('not-rated'),
          contentCategory: rssFeed.contentCategory || getLocale('undefined'),
        },
        rssFeed.ads ? {
          cellLabelIconText: getLocale('advertising-presence'),
          cellLabelIcon: '\uf0a1',
        } : null
      ))
    ],
    []
  ).sort((a, b) => {
    if (a.recommendedAge !== null && b.recommendedAge !== null) {
      return a.recommendedAge - b.recommendedAge
    } else if (a.recommendedAge !== null) {
      return -1
    } else if (b.recommendedAge !== null) {
      return 1
    } else {
      return a.title.localeCompare(b.title)
    }
  }),
  getRssFeedsOrderField = (order) => {
    switch (order) {
      case 1:
        return {field: 'contentCategory', ordering: 'asc'}
      case 2:
        return {field: 'ageCategory', ordering: 'asc'}
      case 3:
        return {field: 'rateCategory', ordering: 'desc'}
      default:
        return {field: 'sectionCategory', ordering: 'asc'}
    }
  }

function RSSFeedList() {
  const
    {getLocale} = useLocale(),
    {addModal, rmModal} = useModal(),
    [rssFeeds, setRssFeeds] = useState([]),
    [order, setOrder] = useState(0),
    rssFeedsTableData = useMemo(
      () => {
        const
          {field, ordering} = getRssFeedsOrderField(order),
          sortFn = ordering === 'asc' ? ((a, b) => a.localeCompare(b)) : ((a, b) => b.localeCompare(a)),
          gRSSFeeds = rssFeeds.reduce(
            (acc, rssFeed) => {
              if (acc[rssFeed[field]] === undefined) {
                return {
                  ...acc,
                  [rssFeed[field]]: {
                    tableGroup: rssFeed[field],
                    tableGroupDisplay: 1,
                    tableChildren: [rssFeed]
                  }
                }
              }
              acc[rssFeed[field]].tableChildren = [
                ...acc[rssFeed[field]].tableChildren,
                rssFeed
              ]
              return acc
            },
            {}
          )
        return Object
          .keys(gRSSFeeds)
          .sort(sortFn)
          .map((k) => gRSSFeeds[k])
      },
      [rssFeeds, order]
    ),

    onSelect = useCallback(
      (rssFeed) => {
        addModal((key) => {
          const modal = <ModalRSSFeedInfo key={key}
                                          rssFeed={rssFeed}
                                          onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [addModal, rmModal]
    ),

    additionalHeaderButtons = useMemo(
      () => <TableHeaderIcon componentIcon={ButtonIconSort}
                             title="sort-order"
                             onClick={() => {
                               setOrder((o) => {
                                 const next = o + 1
                                 if (next > 3) {
                                   return 0
                                 }
                                 return next
                               })
                             }}/>,
      []
    )

  useElectronListener(
    'store-rssfeed-data',
    (data) => setRssFeeds(flatRssFeeds(data, getLocale)),
    []
  )
  useElectronEmitter('store-rssfeed-get', [])

  return <div className={styles.tableContainer}>
    <Table titleLeft={getLocale('discover-rss-feed')}
           data={rssFeedsTableData}
           onSelect={onSelect}
           isLoading={!rssFeedsTableData.length}
           additionalHeaderButtons={additionalHeaderButtons}/>
    <Banner href="https://podcasts.telmi.fr/" src={imageBanner} background="#2c1347"/>
  </div>
}

export default RSSFeedList