import { useCallback, useState } from 'react'
import { useElectronEmitter, useElectronListener } from '../../../Components/Electron/Hooks/UseElectronEvent.js'
import { useModal } from '../../../Components/Modal/ModalHooks.js'
import { useLocale } from '../../../Components/Locale/LocaleHooks.js'
import Table from '../../../Components/Table/Table.js'
import ModalStoreDownload from './ModalStoreDownload.js'
import ModalStoreStoryInfo from './ModalStoreStoryInfo.js'

function StoreContent ({store}) {
  const
    {getLocale} = useLocale(),
    [stories, setStories] = useState([]),
    [storiesSelected, setStoriesSelected] = useState([]),
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
        if (stories.includes(story)) {
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
    )

  useElectronListener(
    'store-remote-data',
    (stories) => {
      const now = Date.now()
      setStories(
        stories.map(
          (s) => {
            const
              isUpdated = now - Date.parse(s.updated_at) < 1296000000,
              isPerfect = s.awards.includes('PARFAIT')
            return {
              ...s,
              isUpdated,
              isPerfect,
              cellTitle: s.age + '+] ' + s.title,
              cellSubtitle: s.description,
              cellLabelIcon: isUpdated ? '\uf274' : (isPerfect ? '\uf559' : undefined),
              cellLabelIconText: isUpdated ? getLocale('update-recent') : (isPerfect ? getLocale('award-perfect') : undefined)
            }
          }
        )
      )
    },
    [setStories]
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
                isLoading={!stories.length}/>
}

export default StoreContent
