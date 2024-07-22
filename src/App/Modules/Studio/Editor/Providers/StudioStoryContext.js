import {createContext} from 'react'

const
  StudioStoryContext = createContext({
    story:null,
    storyVersion: 0
  }),
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
