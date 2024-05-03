import { useCallback, useEffect, useMemo, useState } from 'react'
import { useModal } from '../../../Components/Modal/ModalHooks.js'
import { useLocale } from '../../../Components/Locale/LocaleHooks.js'
import {isCellSelected} from '../../../Components/Table/TableHelpers.js';
import { storiesClassification } from './StoriesClassification.js'
import Table from '../../../Components/Table/Table.js'
import ModalStoryFormUpdate from './ModalStoryFormUpdate.js'
import ModalStoryDeleteConfirm from './ModalStoryDeleteConfirm.js'
import ModalStoriesDeleteConfirm from './ModalStoriesDeleteConfirm.js'
import ModalStoriesFormUpdate from './ModalStoriesFormUpdate.js'

const
  storiesIds = {},
  storyGetId = (str) => {
    if (storiesIds[str] === undefined) {
      storiesIds[str] = Object.values(storiesIds).length
    }
    return storiesIds[str]
  }

function StoriesTable ({stories, className, onEdit, onEditSelected, onDelete, onOptimizeAudio, onOptimizeAudioSelected, selectedStories, setSelectedStories}) {
  const
    {getLocale} = useLocale(),
    {addModal, rmModal} = useModal(),
    [isLoadingStories, setIsLoadingStories] = useState(false),

    {flatTableStories, tableStories} = useMemo(
      () => {
        const flatStories = stories.map((s) => ({
          ...s,
          cellId: storyGetId(s.uuid || s.title),
          cellTitle: (s.age !== undefined ? s.age + '+] ' : '') + s.title,
        }))
        return {
          flatTableStories: flatStories,
          tableStories: storiesClassification(flatStories)
        }
      },
      [stories]
    ),

    onSelect = useCallback(
      (story) => setSelectedStories((stories) => {
        if (isCellSelected(stories, story)) {
          return stories.filter((v) => v.cellId !== story.cellId)
        } else {
          return [...stories, story]
        }
      }),
      [setSelectedStories]
    ),
    onSelectAll = useCallback(
      (stories) => setSelectedStories((currentStories) => {
        if (stories.reduce((acc, story) => isCellSelected(currentStories, story) ? acc + 1 : acc, 0) === stories.length) {
          return currentStories.filter((story) => !isCellSelected(stories, story))
        }
        return [...currentStories, ...stories.filter((story) => !isCellSelected(currentStories, story))]
      }),
      [setSelectedStories]
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
                onSelectAll={onSelectAll}
                onPlay={onPlay}
                onOptimizeAudio={onOptimizeAudio}
                onOptimizeAudioSelected={onOptimizeAudioSelected}
                onEdit={onEdit !== undefined ? callbackOnEdit : undefined}
                onEditSelected={onEditSelected !== undefined ? callbackOnEditSelected : undefined}
                onDelete={callbackOnDelete}
                onDeleteSelected={callbackOnDeleteSelected}
                isLoading={isLoadingStories}/>
}

export default StoriesTable
