import {useCallback, useMemo, useState} from 'react'
import {useLocale} from '../../Components/Locale/LocaleHooks.js'
import {useElectronEmitter, useElectronListener} from '../../Components/Electron/Hooks/UseElectronEvent.js'
import {useModal} from '../../Components/Modal/ModalHooks.js'
import Table from '../../Components/Table/Table.js'
import ModalRSSFeedInfo from './ModalRSSFeedInfo.js'


function RSSFeedList() {
  const
    {getLocale} = useLocale(),
    {addModal, rmModal} = useModal(),
    [rssFeed, setRSSFeed] = useState({}),
    rssFeedTableData = useMemo(
      () => Object.keys(rssFeed).reduce(
        (acc, key) => {
          return [
            ...acc,
            {
              tableGroup: key,
              tableGroupDisplay: 1,
              tableChildren: rssFeed[key].map((child) => Object.assign(
                {
                  ...child,
                  cellTitle: child.title,
                  cellSubtitle: child.category
                },
                child.ads ? {
                  cellLabelIconText: getLocale('advertising-presence'),
                  cellLabelIcon: '\uf0a1',
                } : null
              ))
            }
          ]
        },
        []
      ),
      [getLocale, rssFeed]
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
    )

  useElectronListener(
    'store-rssfeed-data',
    (data) => setRSSFeed(data),
    []
  )
  useElectronEmitter('store-rssfeed-get', [])

  return <Table titleLeft={getLocale('discover-rss-feed')}
                data={rssFeedTableData}
                onSelect={onSelect}/>
}

export default RSSFeedList