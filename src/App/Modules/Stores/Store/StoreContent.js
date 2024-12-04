import {useCallback, useEffect, useMemo, useState} from 'react'
import {useElectronEmitter, useElectronListener} from '../../../Components/Electron/Hooks/UseElectronEvent.js'
import {useModal} from '../../../Components/Modal/ModalHooks.js'
import {useLocale} from '../../../Components/Locale/LocaleHooks.js'
import {isCellSelected} from '../../../Components/Table/TableHelpers.js'
import {useLocalStories} from '../../../Components/LocalStories/LocalStoriesHooks.js'
import Table from '../../../Components/Table/Table.js'
import ModalStoreDownload from './ModalStoreDownload.js'
import ModalStoreStoryInfo from './ModalStoreStoryInfo.js'
import ModalStoreBuildForm from './ModalStoreBuildForm.js'
import TableHeaderIcon from '../../../Components/Table/TableHeaderIcon.js'
import ButtonIconSort from '../../../Components/Buttons/Icons/ButtonIconSort.js'
import ButtonExternalLink from '../../../Components/Link/ButtonExternalLink.js'

import styles from './Store.module.scss'

const
  storeStoriesIds = {},
  storeStoryGetId = (str) => {
    if (storeStoriesIds[str] === undefined) {
      storeStoriesIds[str] = Object.values(storeStoriesIds).length
    }
    return storeStoriesIds[str]
  },
  sortByName = (stories) => stories.sort((a, b) => {
    if ((a.age - b.age) === 0) {
      return a.title.localeCompare(b.title)
    } else {
      return a.age - b.age
    }
  }),
  sortByUpdatedAt = (stories) => stories.sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at))

function StoreContent({store}) {
  const
    {getLocale} = useLocale(),
    {addModal, rmModal} = useModal(),
    localStories = useLocalStories(),
    [storeData, setStoreData] = useState(null),
    [stories, setStories] = useState([]),
    [storiesSelected, setStoriesSelected] = useState([]),
    [isSortedByName, setSortedByName] = useState(true),

    onInfo = useCallback(
      (story) => {
        addModal((key) => {
          const modal = <ModalStoreStoryInfo key={key}
                                             story={story}
                                             onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [addModal, rmModal]
    ),

    onSelect = useCallback(
      (story) => setStoriesSelected((stories) => {
        if (isCellSelected(stories, story)) {
          return stories.filter((v) => v !== story)
        } else {
          return [...stories, story]
        }
      }),
      [setStoriesSelected]
    ),

    onDownloadSelected = useCallback(
      () => {
        if (storeData.audioList) {
          addModal((key) => {
            const modal = <ModalStoreBuildForm key={key}
                                               store={storeData.store}
                                               stories={storiesSelected}
                                               onClose={() => {
                                                 rmModal(modal)
                                                 setStoriesSelected([])
                                               }}/>
            return modal
          })
        } else {
          addModal((key) => {
            const modal = <ModalStoreDownload key={key}
                                              stories={storiesSelected}
                                              onClose={() => {
                                                rmModal(modal)
                                                setStoriesSelected([])
                                              }}/>
            return modal
          })
        }
      },
      [storeData, addModal, getLocale, storiesSelected, rmModal]
    ),
    onDownload = useCallback(
      (story) => {
        addModal((key) => {
          const modal = <ModalStoreDownload key={key}
                                            stories={[story]}
                                            onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [addModal, rmModal]
    ),
    additionalHeaderButtons = useMemo(
      () => <TableHeaderIcon componentIcon={ButtonIconSort}
                             title="sort-name-or-update"
                             onClick={() => {
                               setStories((stories) => [...(isSortedByName ? sortByUpdatedAt(stories) : sortByName(stories))])
                               setSortedByName((sort) => !sort)
                             }}/>,
      [isSortedByName, setStories, setSortedByName]
    )

  useElectronListener('store-remote-data', (response) => setStoreData(response), [])
  useElectronEmitter('store-remote-get', [store])

  useEffect(
    () => {
      if (storeData === null) {
        return
      }
      const
        now = Date.now(),
        lStories = localStories.map((s) => s.uuid)
      setStories(
        sortByName(storeData.data)
          .map(
            (s) => {
              const
                title = (!storeData.audioList ? s.age + '+] ' : '') + s.title,
                isNew = now - Date.parse(s.created_at) < 1296000000,
                isUpdated = now - Date.parse(s.updated_at) < 1296000000,
                isPerfect = s.awards.includes('PARFAIT')

              return {
                ...s,
                isUpdated,
                isPerfect,
                cellId: storeStoryGetId(title),
                cellTitle: title,
                cellSubtitle: s.category,
                cellLabelIcon: isNew ? '\uf005' : (isUpdated ? '\uf274' : (isPerfect ? '\uf559' : undefined)),
                cellLabelIconText: getLocale(isNew ? 'new' : (isUpdated ? 'update-recent' : (isPerfect ? 'award-perfect' : ''))),
                cellDisabled: s.uuid !== '' && lStories.includes(s.uuid)
              }
            }
          )
      )
    },
    [getLocale, localStories, storeData]
  )

  return <>
    <Table titleLeft={getLocale('stories-on-store', stories.length)}
           titleRight={storiesSelected.length ? getLocale('stories-selected', storiesSelected.length) : undefined}
           data={stories}
           onInfo={onInfo}
           selectedData={storiesSelected}
           onSelect={onSelect}
           onDownload={storeData !== null && !storeData.audioList ? onDownload : undefined}
           onDownloadSelected={onDownloadSelected}
           additionalHeaderButtons={additionalHeaderButtons}
           isLoading={!stories.length}/>
    {
      storeData !== null &&
      <ButtonExternalLink href={storeData.banner.link}>
        <div className={styles.bannerContainer} style={{background: storeData.banner.background}}>
          {
            storeData.audioList && <div className={styles.infoAudioList}>
              <h2 className={styles.infoAudioListTitle}><i
                className={[styles.infoAudioListIcon, styles.infoIconRss].join(' ')}></i>{getLocale('rss-feed')}</h2>
              <p className={styles.infoAudioListText}>{getLocale('select-to-build-pack')}</p>
            </div>
          }
          <div className={styles.bannerInnerContainer}>
            <img className={styles.banner} src={storeData.banner.image} alt=""/>
          </div>
        </div>
      </ButtonExternalLink>
    }
  </>
}

export default StoreContent
