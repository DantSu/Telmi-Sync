import {useMemo, useState} from 'react'
import {useElectronEmitter, useElectronListener} from '../../../../Components/Electron/Hooks/UseElectronEvent.js'
import {StudioStoryContext, StudioStoryUpdaterContext} from './StudioStoryContext.js'

function StudioStoryProvider({storyMetadata, children}) {
  const
    [originalStory, setOriginalStory] = useState(null),
    [story, setStory] = useState(null),
    storyUpdater = useMemo(
      () => ({
        updateStory: setStory,
        clearStoryUpdated: () => setOriginalStory(story),
        isStoryUpdated: story !== originalStory
      }),
      [story, originalStory]
    )


  useElectronListener(
    'studio-story-data',
    (sd) => {
      setStory(sd)
      setOriginalStory(sd)
    },
    []
  )
  useElectronEmitter('studio-story-get', [storyMetadata])

  return <StudioStoryContext.Provider value={story}>
    <StudioStoryUpdaterContext.Provider value={storyUpdater}>
      {children}
    </StudioStoryUpdaterContext.Provider>
  </StudioStoryContext.Provider>
}

export default StudioStoryProvider
