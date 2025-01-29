import {useCallback, useMemo} from 'react'
import {useModal} from '../../../Components/Modal/ModalHooks.js'
import {useTelmiOS} from '../../../Components/TelmiOS/TelmiOSHooks.js'
import {useLocalStories} from '../../../Components/LocalStories/LocalStoriesHooks.js'
import {useRouter} from '../../../Router/RouterHooks.js'
import {getRouteStudio} from '../../Studio/Routes.js'

import StoriesTable from './StoriesTable.js'
import ModalStoriesOptimizeAudio from './ModalStoriesOptimizeAudio.js'
import ModalPlayerLauncher from '../../Studio/Player/ModalPlayerLauncher.js'

const {ipcRenderer} = window.require('electron')

function StoriesLocalContent({setSelectedStories, selectedStories}) {
  const
    localStories = useLocalStories(),
    {stories: telmiOSStories} = useTelmiOS(),
    {addModal, rmModal} = useModal(),
    setRoute = useRouter(),

    stories = useMemo(
      () => {
        const tStories = telmiOSStories.reduce((acc, s) => ({...acc, [s.uuid]: s.version}), {})
        return localStories.map((s) => ({...s, cellDisabled: tStories[s.uuid] !== undefined && tStories[s.uuid] >= s.version}))
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

    onPlay = useCallback(
      (story) => {
        addModal((key) => {
          const modal = <ModalPlayerLauncher key={'modal-launcher-' + key}
                                             storyMetadata={story}
                                             onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [addModal, rmModal]
    ),

    onStudio = useCallback(
      (story) => setRoute(getRouteStudio(story)),
      [setRoute]
    ),

    onAdd = useCallback(
      () => setRoute(getRouteStudio({})),
      [setRoute]
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

  return <StoriesTable id="stories-local"
                       stories={stories}
                       onOptimizeAudio={onOptimizeAudio}
                       onOptimizeAudioSelected={onOptimizeAudioSelected}
                       onStudio={onStudio}
                       onPlay={onPlay}
                       onEdit={onEdit}
                       onAdd={onAdd}
                       onEditSelected={onEditSelected}
                       onDelete={onDelete}
                       setSelectedStories={setSelectedStories}
                       selectedStories={selectedStories}/>
}

export default StoriesLocalContent
