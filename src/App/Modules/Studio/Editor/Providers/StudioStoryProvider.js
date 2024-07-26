import {useEffect, useMemo, useState} from 'react'
import {useElectronEmitter, useElectronListener} from '../../../../Components/Electron/Hooks/UseElectronEvent.js'
import {StudioStoryContext, StudioStoryUpdaterContext, StudioStoryVersionsContext} from './StudioStoryContext.js'


const checkBackNode = (story) => {
  if (story.nodes.stages.backStage !== undefined) {
    return story
  }

  story.nodes.stages.backStage = {
    audio: null,
    image: null,
    ok: {action: 'backChildAction', index: 0},
    home: null,
    control: {
      ok: true,
      home: false,
      autoplay: true
    }
  }
  story.nodes.actions.backAction = [{stage: 'backStage'}]
  story.nodes.actions.backChildAction = []
  story.notes.backStage = {title: 'Back Button Pressed', notes: ''}
  Object.values(story.nodes.stages).forEach((stage) => {
    if (stage.home === null) {
      stage.home = {action: 'backAction', index: 0}
    }
  })

  return story
}

function StudioStoryProvider({storyMetadata, children}) {
  const
    [undo, setUndo] = useState([]),
    [redo, setRedo] = useState([]),
    [originalStory, setOriginalStory] = useState(null),
    [story, setStory] = useState(null),
    [storyVersion, setStoryVersion] = useState(0),
    storyData = useMemo(
      () => ({story, storyVersion}),
      [story, storyVersion]
    ),
    storyUpdater = useMemo(
      () => ({
        updateStory: (story) => {
          setRedo([])
          setStory(story)
        },
        isStoryUpdated: undo[0] !== originalStory
      }),
      [undo, originalStory]
    ),
    storyVersions = useMemo(
      () => ({
        onUndo: () => {
          if (undo.length > 1) {
            setStory(JSON.parse(undo[1]))
            setStoryVersion((v) => v + 1)
            setUndo(undo.slice(1))
            setRedo((r) => [undo[0], ...r])
          }
        },
        onRedo: () => {
          if (redo.length > 0) {
            setStory(JSON.parse(redo[0]))
            setStoryVersion((v) => v + 1)
            setUndo((u) => [redo[0], ...u])
            setRedo(redo.slice(1))
          }
        },
        hasUndo: undo.length > 1,
        hasRedo: redo.length > 0
      }),
      [undo, redo]
    )

  useElectronListener(
    'studio-story-data',
    (sd) => {
      const sdChecked = checkBackNode(sd)
      setUndo([])
      setRedo([])
      setStory(sdChecked)
      setStoryVersion((v) => v + 1)
      setOriginalStory(JSON.stringify(sdChecked))
    },
    []
  )
  useElectronEmitter('studio-story-get', [storyMetadata])

  useEffect(
    () => {
      if (story !== null) {
        const json = JSON.stringify(story)
        setUndo((u) => json !== u[0] ? [json, ...u.slice(0, 9)] : u)
      }
    },
    [story]
  )

  return <StudioStoryContext.Provider value={storyData}>
    <StudioStoryUpdaterContext.Provider value={storyUpdater}>
      <StudioStoryVersionsContext.Provider value={storyVersions}>
        {children}
      </StudioStoryVersionsContext.Provider>
    </StudioStoryUpdaterContext.Provider>
  </StudioStoryContext.Provider>
}

export default StudioStoryProvider
