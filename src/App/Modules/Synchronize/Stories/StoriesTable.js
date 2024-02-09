import { useCallback, useEffect, useMemo, useState } from 'react'
import { useModal } from '../../../Components/Modal/ModalHooks.js'
import { useLocale } from '../../../Components/Locale/LocaleHooks.js'
import Table from '../../../Components/Table/Table.js'
import ModalStoryFormUpdate from './ModalStoryFormUpdate.js'
import ModalStoryDeleteConfirm from './ModalStoryDeleteConfirm.js'
import ModalStoriesDeleteConfirm from './ModalStoriesDeleteConfirm.js'

function StoriesTable ({stories, className, onEdit, onDelete, selectedStories, setSelectedStories}) {
  const
    {getLocale} = useLocale(),
    {addModal, rmModal} = useModal(),
    [isLoadingStories, setIsLoadingStories] = useState(false),
    tableStories = useMemo(
      () => stories.map((s) => ({
        ...s,
        cellTitle: s.title,
        cellSubtitle: s.uuid,
      })),
      [stories]
    ),
    onSelect = useCallback(
      (story) => setSelectedStories((stories) => {
        if (stories.includes(story)) {
          return stories.filter((v) => v !== story)
        } else {
          return [...stories, story]
        }
      }),
      [setSelectedStories]
    ),
    onSelectAll = useCallback(
      () => setSelectedStories((stories) => {
        if (stories.length === tableStories.length) {
          return []
        } else {
          return [...tableStories]
        }
      }),
      [tableStories, setSelectedStories]
    ),
    onPlay = useCallback((story) => (new Audio(story.audio)).play(), []),
    callbackOnEdit = useCallback(
      (story) => {
        addModal((key) => {
          const modal = <ModalStoryFormUpdate key={key}
                                              story={story}
                                              onValidate={(story) => {
                                                onEdit(story)
                                                setIsLoadingStories(true)
                                              }}
                                              onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [onEdit, addModal, rmModal]
    ),
    callbackOnDelete = useCallback(
      (story) => {
        addModal((key) => {
          const modal = <ModalStoryDeleteConfirm key={key}
                                                 story={story}
                                                 onConfirm={() => {
                                                   onDelete([story.uuid])
                                                   setIsLoadingStories(true)
                                                 }}
                                                 onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [onDelete, addModal, rmModal]
    ),
    callbackOnDeleteSelected = useCallback(
      () => {
        if (!selectedStories.length) {
          return
        }
        addModal((key) => {
          const modal = <ModalStoriesDeleteConfirm key={key}
                                                   onConfirm={() => {
                                                     onDelete(selectedStories.map((v) => v.uuid))
                                                     setIsLoadingStories(true)
                                                     setSelectedStories([])
                                                   }}
                                                   onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [onDelete, selectedStories, setSelectedStories, addModal, rmModal]
    )

  useEffect(() => {setIsLoadingStories(false)}, [stories, setIsLoadingStories])

  return <Table titleLeft={getLocale('stories-local', tableStories.length)}
                titleRight={selectedStories.length ? getLocale('stories-selected', selectedStories.length) : undefined}
                className={className}
                data={tableStories}
                selectedData={selectedStories}
                onSelect={onSelect}
                onSelectAll={onSelectAll}
                onPlay={onPlay}
                onEdit={onEdit !== undefined ? callbackOnEdit : undefined}
                onDelete={callbackOnDelete}
                onDeleteSelected={callbackOnDeleteSelected}
                isLoading={isLoadingStories}/>
}

export default StoriesTable
