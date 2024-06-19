import {createContext} from 'react'

const
  StudioStoryContext = createContext(null),
  StudioStoryUpdaterContext = createContext({
    updateStory: (story) => {},
    clearStoryUpdated: () => {},
    isStoryUpdated: false
  })


export {StudioStoryContext, StudioStoryUpdaterContext}
