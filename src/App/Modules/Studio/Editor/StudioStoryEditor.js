import {useCallback} from 'react'

import StudioStoryProvider from './Providers/StudioStoryProvider.js'
import StudioStageProvider from './Providers/StudioStageProvider.js'
import StudioStoryEditorLayout from './StudioStoryEditorLayout.js'


function StudioStoryEditor({story, setStory}) {
  const closeEditor = useCallback(() => setStory(null), [setStory])

  return <StudioStoryProvider storyMetadata={story}>
    <StudioStageProvider>
      <StudioStoryEditorLayout closeEditor={closeEditor}/>
    </StudioStageProvider>
  </StudioStoryProvider>
}

export default StudioStoryEditor