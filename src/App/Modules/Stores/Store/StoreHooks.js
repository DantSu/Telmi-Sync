import {useCallback, useEffect, useMemo, useState} from 'react'
import {useLocale} from '../../../Components/Locale/LocaleHooks.js'
import {useModal} from '../../../Components/Modal/ModalHooks.js'
import {isCellSelected} from '../../../Components/Table/TableHelpers.js'
import {useLocalStories} from '../../../Components/LocalStories/LocalStoriesHooks.js'
import TableHeaderIcon from '../../../Components/Table/TableHeaderIcon.js'
import ButtonIconSort from '../../../Components/Buttons/Icons/ButtonIconSort.js'
import ModalStoreStoryInfo from './ModalStoreStoryInfo.js'
import {sortByName, sortByUpdatedAt} from './StoreStorySortHelpers.js'

const {ipcRenderer} = window.require('electron')

const
  storeStoriesIds = {},
  storeStoryGetId = (str) => {
    if (storeStoriesIds[str] === undefined) {
      storeStoriesIds[str] = Object.values(storeStoriesIds).length
    }
    return storeStoriesIds[str]
  },

  useStoreContent = (store, storeData) => {
    const
      {getLocale} = useLocale(),
      {addModal, rmModal} = useModal(),
      localStories = useLocalStories(),
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

      additionalHeaderButtons = useMemo(
        () => <TableHeaderIcon componentIcon={ButtonIconSort}
                               title="sort-by-name-or-date"
                               onClick={() => {
                                 store.isSortedByName = !isSortedByName
                                 setStories((stories) => [...(store.isSortedByName ? sortByName(stories) : sortByUpdatedAt(stories))])
                                 setSortedByName(store.isSortedByName)
                                 ipcRenderer.send('store-update', store)
                               }}/>,
        [store, isSortedByName]
      )

    useEffect(
      () => {
        if (storeData === null) {
          return
        }

        if (store.isSortedByName === undefined) {
          store.isSortedByName = !storeData.audioList
        }

        const
          now = Date.now(),
          lStories = localStories.reduce((acc, s) => ({...acc, [s.uuid]: s.version}), {}),
          storiesSorted = store.isSortedByName ? sortByName(storeData.data) : sortByUpdatedAt(storeData.data)

        setSortedByName(store.isSortedByName)

        setStories(
          storiesSorted
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
                  cellDisabled: s.uuid !== '' && lStories[s.uuid] !== undefined && lStories[s.uuid] >= s.version
                }
              }
            )
        )
      },
      [store, getLocale, localStories, storeData]
    )

    return {stories, setStories, storiesSelected, setStoriesSelected, isSortedByName, setSortedByName, onInfo, onSelect, additionalHeaderButtons}
  }

export {useStoreContent}