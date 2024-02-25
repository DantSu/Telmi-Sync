import { useCallback, useEffect, useMemo, useState } from 'react'
import { useModal } from '../../../Components/Modal/ModalHooks.js'
import { useLocale } from '../../../Components/Locale/LocaleHooks.js'
import Table from '../../../Components/Table/Table.js'
import ModalStoryFormUpdate from './ModalStoryFormUpdate.js'
import ModalStoryDeleteConfirm from './ModalStoryDeleteConfirm.js'
import ModalStoriesDeleteConfirm from './ModalStoriesDeleteConfirm.js'
import ModalStoriesFormUpdate from './ModalStoriesFormUpdate.js'
import { storiesClassification } from './StoriesClassification.js'

function StoriesTable ({stories, className, onEdit, onEditSelected, onDelete, selectedStories, setSelectedStories}) {
  const
    {getLocale} = useLocale(),
    {addModal, rmModal} = useModal(),
    [isLoadingStories, setIsLoadingStories] = useState(false),

    {flatTableStories, tableStories} = useMemo(
      () => {
        const flatStories = stories.map((s) => ({
          ...s,
          cellTitle: s.age + '+] ' + s.title,
          cellSubtitle: s.uuid,
        })).sort((a, b) => a.cellTitle.localeCompare(b.cellTitle))
        return {
          flatTableStories: flatStories,
          tableStories: storiesClassification(flatStories)
        }
      },
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
    onSelectGroup = useCallback(
      (stories) => setSelectedStories((currentStories) => {
        if (stories.reduce((acc, s) => currentStories.includes(s) ? acc + 1 : acc, 0) === stories.length) {
          return currentStories.filter((s) => !stories.includes(s))
        }
        return [...currentStories, ...stories.filter((s) => !currentStories.includes(s))]
      }),
      [setSelectedStories]
    ),
    onSelectAll = useCallback(
      () => setSelectedStories((stories) => {
        if (stories.length === flatTableStories.length) {
          return []
        } else {
          return [...flatTableStories]
        }
      }),
      [flatTableStories, setSelectedStories]
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
                                                setSelectedStories([])
                                              }}
                                              onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [onEdit, setSelectedStories, setIsLoadingStories, addModal, rmModal]
    ),
    callbackOnEditSelected = useCallback(
      () => {
        addModal((key) => {
          const modal = <ModalStoriesFormUpdate key={key}
                                              stories={selectedStories}
                                              onValidate={(stories) => {
                                                onEditSelected(stories)
                                                setIsLoadingStories(true)
                                                setSelectedStories([])
                                              }}
                                              onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [onEditSelected, selectedStories, setSelectedStories, setIsLoadingStories, addModal, rmModal]
    ),
    callbackOnDelete = useCallback(
      (story) => {
        addModal((key) => {
          const modal = <ModalStoryDeleteConfirm key={key}
                                                 story={story}
                                                 onConfirm={() => {
                                                   onDelete([story])
                                                   setIsLoadingStories(true)
                                                   setSelectedStories([])
                                                 }}
                                                 onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [onDelete, setSelectedStories, setIsLoadingStories, addModal, rmModal]
    ),

    callbackOnDeleteSelected = useCallback(
      () => {
        if (!selectedStories.length) {
          return
        }
        addModal((key) => {
          const modal = <ModalStoriesDeleteConfirm key={key}
                                                   onConfirm={() => {
                                                     onDelete(selectedStories)
                                                     setIsLoadingStories(true)
                                                     setSelectedStories([])
                                                   }}
                                                   onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [onDelete, selectedStories, setSelectedStories, setIsLoadingStories, addModal, rmModal]
    )

  useEffect(() => {setIsLoadingStories(false)}, [stories, setIsLoadingStories])

  return <Table titleLeft={getLocale('stories-local', flatTableStories.length)}
                titleRight={selectedStories.length ? getLocale('stories-selected', selectedStories.length) : undefined}
                className={className}
                data={tableStories}
                selectedData={selectedStories}
                onSelect={onSelect}
                onSelectGroup={onSelectGroup}
                onSelectAll={onSelectAll}
                onPlay={onPlay}
                onEdit={onEdit !== undefined ? callbackOnEdit : undefined}
                onEditSelected={onEditSelected !== undefined ? callbackOnEditSelected : undefined}
                onDelete={callbackOnDelete}
                onDeleteSelected={callbackOnDeleteSelected}
                isLoading={isLoadingStories}/>
}

export default StoriesTable
