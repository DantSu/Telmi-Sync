import {useContext} from 'react'
import {StudioStoryContext, StudioStoryUpdaterContext} from './StudioStoryContext.js'

const
  useStudioStory = () => useContext(StudioStoryContext),
  useStudioStoryUpdater = () => useContext(StudioStoryUpdaterContext)

export {useStudioStory, useStudioStoryUpdater}
