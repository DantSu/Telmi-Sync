import {useEffect, useMemo, useState} from 'react'
import {useElectronEmitter, useElectronListener} from '../../../../Components/Electron/Hooks/UseElectronEvent.js'
import {StudioStoryContext, StudioStoryUpdaterContext, StudioStoryVersionsContext} from './StudioStoryContext.js'

function StudioStoryProvider({storyMetadata, children}) {
  const
    [undo, setUndo] = useState([]),
    [redo, setRedo] = useState([]),
    [originalStory, setOriginalStory] = useState(null),
    [story, setStory] = useState(null),
    storyUpdater = useMemo(
      () => ({
        updateStory: (story) => {
          setRedo([])
          setStory(story)
        },
        isStoryUpdated: story !== originalStory
      }),
      [story, originalStory]
    ),
    storyVersions = useMemo(
      () => ({
        onUndo: () => {
          if (undo.length > 1) {
            setStory(JSON.parse(undo[1]))
            setUndo(undo.slice(1))
            setRedo((r) => [undo[0], ...r])
          }
        },
        onRedo: () => {
          if (redo.length > 0) {
            setStory(JSON.parse(redo[0]))
            setUndo((u) => [redo[0], ...u])
            setRedo(redo.slice(1))
          }
        },
        hasUndo: undo.length > 1,
        hasRedo: redo.length > 0
      }),
      [undo, redo]
    )

  useEffect(
    () => {
      if (story !== null) {
        const json = JSON.stringify(story)
        setUndo((u) => json !== u[0] ? [json, ...u.slice(0, 9)] : u)
      }
    },
    [story]
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
      <StudioStoryVersionsContext.Provider value={storyVersions}>
        {children}
      </StudioStoryVersionsContext.Provider>
    </StudioStoryUpdaterContext.Provider>
  </StudioStoryContext.Provider>
}

export default StudioStoryProvider
