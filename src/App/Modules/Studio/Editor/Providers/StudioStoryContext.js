import {createContext} from 'react'

const
  StudioStoryContext = createContext(null),
  StudioStoryUpdaterContext = createContext({
    updateStory: (story) => {},
    isStoryUpdated: false
  })


export {StudioStoryContext, StudioStoryUpdaterContext}
