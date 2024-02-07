import { useCallback, useEffect, useMemo, useState } from 'react'
import { useModal } from '../../../Components/Modal/ModalHooks.js'
import { useLocalStories } from '../../../Components/LocalStories/LocalStoriesHooks.js'
import Table from '../../../Components/Table/Table.js'
import ModalStoryFormUpdate from './ModalStoryFormUpdate.js'
import ModalStoryDeleteConfirm from './ModalStoryDeleteConfirm.js'
import ModalStoriesDeleteConfirm from './ModalStoriesDeleteConfirm.js'

const {ipcRenderer} = window.require('electron')

function StoriesLocalContent ({selectedLocalStories, setSelectedLocalStories}) {
  const
    {addModal, rmModal} = useModal(),
    rawLocalStories = useLocalStories(),
    [isLoadingLocalStories, setIsLoadingLocalStories] = useState(false),
    localStories = useMemo(
      () => rawLocalStories.map((s) => ({
        ...s,
        cellTitle: s.title,
        cellSubtitle: s.uuid,
      })),
      [rawLocalStories]
    ),
    onSelect = useCallback(
      (story) => setSelectedLocalStories((stories) => {
        if (stories.includes(story)) {
          return stories.filter((v) => v !== story)
        } else {
          return [...stories, story]
        }
      }),
      [setSelectedLocalStories]
    ),
    onSelectAll = useCallback(
      () => setSelectedLocalStories((stories) => {
        if (stories.length === localStories.length) {
          return []
        } else {
          return [...localStories]
        }
      }),
      [localStories, setSelectedLocalStories]
    ),
    onPlay = useCallback((story) => (new Audio(story.audio)).play(), []),
    onEdit = useCallback(
      (story) => {
        addModal((key) => {
          const modal = <ModalStoryFormUpdate key={key}
                                              story={story}
                                              onValidate={(story) => {
                                                setIsLoadingLocalStories(true)
                                                ipcRenderer.send('local-story-update', story.uuid, story.title)
                                              }}
                                              onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [addModal, rmModal]
    ),
    onDelete = useCallback(
      (story) => {
        addModal((key) => {
          const modal = <ModalStoryDeleteConfirm key={key}
                                                 story={story}
                                                 onConfirm={() => {
                                                   ipcRenderer.send('local-stories-delete', [story.uuid])
                                                   setIsLoadingLocalStories(true)
                                                 }}
                                                 onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [addModal, rmModal]
    ),
    onDeleteSelected = useCallback(
      () => {
        if (!selectedLocalStories.length) {
          return
        }
        addModal((key) => {
          const modal = <ModalStoriesDeleteConfirm key={key}
                                                   onConfirm={() => {
                                                     ipcRenderer.send('local-stories-delete', selectedLocalStories.map((v) => v.uuid))
                                                     setIsLoadingLocalStories(true)
                                                     setSelectedLocalStories([])
                                                   }}
                                                   onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [selectedLocalStories, setSelectedLocalStories, addModal, rmModal]
    )

  useEffect(() => {setIsLoadingLocalStories(false)}, [rawLocalStories, setIsLoadingLocalStories])

  return <Table titleLeft={'Mes histoires (' + localStories.length + ')'}
                titleRight={selectedLocalStories.length ? selectedLocalStories.length + ' histoire(s) sélectionné(s)' : undefined}
                data={localStories}
                selectedData={selectedLocalStories}
                onSelect={onSelect}
                onSelectAll={onSelectAll}
                onPlay={onPlay}
                onEdit={onEdit}
                onDelete={onDelete}
                onDeleteSelected={onDeleteSelected}
                isLoading={isLoadingLocalStories}/>
}

export default StoriesLocalContent
