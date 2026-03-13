import {useMemo, useState} from 'react'
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
        updateStory: (ss) => {
          setStory((s) => {
            const story = typeof ss === 'function' ? ss(s) : ss
            const json = JSON.stringify(story)
            setRedo([])
            setUndo((u) => json !== u[0] ? [json, ...u.slice(0, 9)] : u)
            return story
          })
        }
      }),
      []
    ),
    storyVersionsOnEvent = useMemo(
      () => ({
        onUndo: () => setUndo((u) => {
          if (u.length > 1) {
            setStory(JSON.parse(u[1]))
            setStoryVersion((v) => v + 1)
            setRedo((r) => [u[0], ...r])
            return u.slice(1)
          }
          return u
        }),
        onRedo: () => setRedo((r) => {
          if (r.length > 0) {
            setStory(JSON.parse(r[0]))
            setStoryVersion((v) => v + 1)
            setUndo((u) => [r[0], ...u])
            return r.slice(1)
          }
          return r
        })
      }),
      []
    ),
    storyVersions = useMemo(
      () => ({
        hasUndo: undo.length > 1,
        hasRedo: redo.length > 0
      }),
      [undo, redo]
    )

  useElectronListener(
    'studio-story-data',
    (sd) => {
      const
        sdChecked = checkBackNode(sd),
        json = JSON.stringify(sdChecked)
      setUndo([json])
      setRedo([])
      setStory(sdChecked)
      setStoryVersion((v) => v + 1)
      setOriginalStory(json)
    },
    []
  )
  useElectronEmitter('studio-story-get', [storyMetadata])

  return <StudioStoryContext.Provider value={storyData}>
    <StudioStoryUpdaterContext.Provider value={{...storyUpdater, isStoryUpdated: undo[0] !== originalStory}}>
      <StudioStoryVersionsContext.Provider value={{...storyVersionsOnEvent, ...storyVersions}}>
        {children}
      </StudioStoryVersionsContext.Provider>
    </StudioStoryUpdaterContext.Provider>
  </StudioStoryContext.Provider>
}

export default StudioStoryProvider
