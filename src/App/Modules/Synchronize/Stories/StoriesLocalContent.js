import { useCallback, useEffect, useMemo, useState } from 'react'
import { useModal } from '../../../Components/Modal/ModalHooks.js'
import { useLocalStories } from '../../../Components/LocalStories/LocalStoriesHooks.js'
import Table from '../../../Components/Table/Table.js'
import ModalDialogConfirm from '../../../Components/Modal/Templates/ModalDialogs/ModalDialogConfirm.js'
import ModalStoryFormUpdate from './ModalStoryFormUpdate.js'

const {ipcRenderer} = window.require('electron')

function StoriesLocalContent ({selectedLocalStories, setSelectedLocalStories}) {
  const
    {addModal, rmModal} = useModal(),
    rawLocalStories = useLocalStories(),
    [isLoadingLocalStories, setIsLoadingLocalStories] = useState(false),
    localStories = useMemo(
      () => rawLocalStories.map((s) => ({
        ...s,
        subtitle: s.uuid,
      })),
      [rawLocalStories]
    ),
    onLocalStorySelect = useCallback(
      (story) => setSelectedLocalStories((stories) => {
        if (stories.includes(story)) {
          return stories.filter((v) => v !== story)
        } else {
          return [...stories, story]
        }
      }),
      [setSelectedLocalStories]
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
          const modal = <ModalDialogConfirm key={key}
                                            title="Suppression d'histoire"
                                            message={<>Êtes-vous sûr de vouloir supprimer
                                              l'histoire <strong>"{story.title}"</strong> ?</>}
                                            onConfirm={() => {
                                              setIsLoadingLocalStories(true)
                                              ipcRenderer.send('local-story-delete', story.uuid)
                                            }}
                                            onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [addModal, rmModal]
    )

  useEffect(() => {setIsLoadingLocalStories(false)}, [rawLocalStories, setIsLoadingLocalStories])

  return <Table titleLeft={'Mes histoires (' + localStories.length + ')'}
                titleRight={selectedLocalStories.length ? selectedLocalStories.length + ' histoire(s) sélectionné(s)' : undefined}
                data={localStories}
                selectedData={selectedLocalStories}
                onSelect={onLocalStorySelect}
                onPlay={onPlay}
                onEdit={onEdit}
                onDelete={onDelete}
                isLoading={isLoadingLocalStories}/>
}

export default StoriesLocalContent
