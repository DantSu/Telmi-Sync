import { useCallback } from 'react'
import { useLocalStories } from '../../../Components/LocalStories/LocalStoriesHooks.js'

import StoriesTable from './StoriesTable.js'

const {ipcRenderer} = window.require('electron')

function StoriesLocalContent ({setSelectedStories, selectedStories}) {
  const
    localStories = useLocalStories(),
    onEdit = useCallback(
      (story) => ipcRenderer.send('local-story-update', story.uuid, story.title),
      []
    ),
    onDelete = useCallback(
      (storiesUuid) => ipcRenderer.send('local-stories-delete', storiesUuid),
      []
    )

  return <StoriesTable stories={localStories}
                       onEdit={onEdit}
                       onDelete={onDelete}
                       setSelectedStories={setSelectedStories}
                       selectedStories={selectedStories}/>
}

export default StoriesLocalContent
