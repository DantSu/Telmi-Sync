import { useCallback, useMemo } from 'react'
import { useLocalStories } from '../../../Components/LocalStories/LocalStoriesHooks.js'

import StoriesTable from './StoriesTable.js'
import { useTelmiOS } from '../../../Components/TelmiOS/TelmiOSHooks.js'

const {ipcRenderer} = window.require('electron')

function StoriesLocalContent ({setSelectedStories, selectedStories}) {
  const
    localStories = useLocalStories(),
    {stories: telmiOSStories} = useTelmiOS(),

    stories = useMemo(
      () => {
        const tStories = telmiOSStories.map((s) => s.uuid)
        return localStories.map((s) => ({...s, cellDisabled: tStories.includes(s.uuid)}))
      },
      [localStories, telmiOSStories]
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
                       onEdit={onEdit}
                       onEditSelected={onEditSelected}
                       onDelete={onDelete}
                       setSelectedStories={setSelectedStories}
                       selectedStories={selectedStories}/>
}

export default StoriesLocalContent
