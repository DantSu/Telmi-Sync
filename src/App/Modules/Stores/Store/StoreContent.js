import { useCallback, useMemo, useState } from 'react'
import { useElectronEmitter, useElectronListener } from '../../../Components/Electron/Hooks/UseElectronEvent.js'
import { useModal } from '../../../Components/Modal/ModalHooks.js'
import { useLocale } from '../../../Components/Locale/LocaleHooks.js'
import {isCellSelected} from '../../../Components/Table/TableHelpers.js';
import {useLocalStories} from '../../../Components/LocalStories/LocalStoriesHooks.js'
import Table from '../../../Components/Table/Table.js'
import ModalStoreDownload from './ModalStoreDownload.js'
import ModalStoreStoryInfo from './ModalStoreStoryInfo.js'
import TableHeaderIcon from '../../../Components/Table/TableHeaderIcon.js'
import ButtonIconSort from '../../../Components/Buttons/Icons/ButtonIconSort.js'

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

function StoreContent ({store}) {
  const
    {getLocale} = useLocale(),
    localStories = useLocalStories(),
    [stories, setStories] = useState([]),
    [storiesSelected, setStoriesSelected] = useState([]),
    [isSortedByName, setSortedByName] = useState(true),
    {addModal, rmModal} = useModal(),

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
        addModal((key) => {
          const modal = <ModalStoreDownload key={key}
                                            stories={storiesSelected}
                                            onClose={() => {
                                              rmModal(modal)
                                              setStoriesSelected([])
                                            }}/>
          return modal
        })
      },
      [storiesSelected, setStoriesSelected, addModal, rmModal]
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

  useElectronListener(
    'store-remote-data',
    (stories) => {
      const
        now = Date.now(),
        lStories = localStories.map((s) => s.uuid)
      setStories(
        sortByName(stories)
          .map(
            (s) => {
              const
                title = s.age + '+] ' + s.title,
                isNew = now - Date.parse(s.created_at) < 1296000000,
                isUpdated = now - Date.parse(s.updated_at) < 1296000000,
                isPerfect = s.awards.includes('PARFAIT')
              return {
                ...s,
                isUpdated,
                isPerfect,
                cellId: storeStoryGetId(title),
                cellTitle: title,
                cellSubtitle: s.description,
                cellLabelIcon: isNew ? '\uf005' : (isUpdated ? '\uf274' : (isPerfect ? '\uf559' : undefined)),
                cellLabelIconText: getLocale(isNew ? 'new' : (isUpdated ? 'update-recent' : (isPerfect ? 'award-perfect' : ''))),
                cellDisabled: s.uuid !== '' && lStories.includes(s.uuid)
              }
            }
          )
      )
    },
    [setStories, localStories]
  )
  useElectronEmitter('store-remote-get', [store])

  return <Table titleLeft={getLocale('stories-on-store', stories.length)}
                titleRight={storiesSelected.length ? getLocale('stories-selected', storiesSelected.length) : undefined}
                data={stories}
                onInfo={onInfo}
                selectedData={storiesSelected}
                onSelect={onSelect}
                onDownload={onDownload}
                onDownloadSelected={onDownloadSelected}
                additionalHeaderButtons={additionalHeaderButtons}
                isLoading={!stories.length}/>
}

export default StoreContent
