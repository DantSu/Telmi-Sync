import { useCallback, useMemo } from 'react'
import { useModal } from '../../../Components/Modal/ModalHooks.js'
import { useTelmiOS } from '../../../Components/TelmiOS/TelmiOSHooks.js'
import { useLocalStories } from '../../../Components/LocalStories/LocalStoriesHooks.js'

import StoriesTable from './StoriesTable.js'
import ModalStoriesOptimizeAudio from './ModalStoriesOptimizeAudio.js'

const {ipcRenderer} = window.require('electron')

function StoriesLocalContent ({setSelectedStories, selectedStories}) {
  const
    localStories = useLocalStories(),
    {stories: telmiOSStories} = useTelmiOS(),
    {addModal, rmModal} = useModal(),

    stories = useMemo(
      () => {
        const tStories = telmiOSStories.map((s) => s.uuid)
        return localStories.map((s) => ({...s, cellDisabled: tStories.includes(s.uuid)}))
      },
      [localStories, telmiOSStories]
    ),

    onOptimizeAudio = useCallback(
      (story) => {
        addModal((key) => {
          const modal = <ModalStoriesOptimizeAudio key={key}
                                                   stories={[story]}
                                                   onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [addModal, rmModal]
    ),

    onOptimizeAudioSelected = useCallback(
      () => {
        addModal((key) => {
          const modal = <ModalStoriesOptimizeAudio key={key}
                                                   stories={selectedStories}
                                                   onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [selectedStories, addModal, rmModal]
    ),

    onEdit = useCallback(
      (story) => ipcRenderer.send('local-stories-update', [story]),
      []
    ),
    onEditSelected = useCallback(
      (stories) => ipcRenderer.send('local-stories-update', stories),
      []
    ),
    onDelete = useCallback(
      (stories) => ipcRenderer.send('local-stories-delete', stories),
      []
    )

  return <StoriesTable stories={stories}
                       onOptimizeAudio={onOptimizeAudio}
                       onOptimizeAudioSelected={onOptimizeAudioSelected}
                       onEdit={onEdit}
                       onEditSelected={onEditSelected}
                       onDelete={onDelete}
                       setSelectedStories={setSelectedStories}
                       selectedStories={selectedStories}/>
}

export default StoriesLocalContent
