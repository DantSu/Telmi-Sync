import {createContext} from 'react'

const
  StudioStoryContext = createContext(null),
  StudioStoryUpdaterContext = createContext({
    updateStory: (story) => {},
    isStoryUpdated: false
  }),
  StudioStoryVersionsContext = createContext({
    onUndo: () => {},
    onRedo: () => {},
    hasUndo: false,
    hasRedo: false
  })


export {StudioStoryContext, StudioStoryUpdaterContext, StudioStoryVersionsContext}
