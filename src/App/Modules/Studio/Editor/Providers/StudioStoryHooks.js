import {useContext} from 'react'
import {StudioStoryContext, StudioStoryUpdaterContext, StudioStoryVersionsContext} from './StudioStoryContext.js'

const
  useStudioStory = () => useContext(StudioStoryContext),
  useStudioStoryUpdater = () => useContext(StudioStoryUpdaterContext),
  useStudioStoryVersions = () => useContext(StudioStoryVersionsContext)

export {useStudioStory, useStudioStoryUpdater, useStudioStoryVersions}
