import { useCallback, useState } from 'react'
import { useElectronEmitter, useElectronListener } from '../../../Components/Electron/Hooks/UseElectronEvent.js'
import Table from '../../../Components/Table/Table.js'
import { useModal } from '../../../Components/Modal/ModalHooks.js'
import ModalStoreDownload from './ModalStoreDownload.js'

function StoreContent ({store}) {
  const
    [stories, setStories] = useState([]),
    [storiesSelected, setStoriesSelected] = useState([]),
    {addModal, rmModal} = useModal(),

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
    (stories) => setStories(stories.map((s) => ({...s, cellTitle: s.title}))),
    [setStories]
  )
  useElectronEmitter('store-remote-get', [store])

  return <Table titleLeft={stories.length + ' histoires sur le store'}
                titleRight={storiesSelected.length ? storiesSelected.length + ' histoire(s) sélectionnée(s)' : undefined}
                data={stories}
                selectedData={storiesSelected}
                onSelect={onSelect}
                onDownload={onDownload}
                onDownloadSelected={onDownloadSelected}
                isLoading={!stories.length}/>
}

export default StoreContent
