import {useCallback} from 'react'
import {useRouter} from '../../../Router/RouterHooks.js'
import {routeSynchronize} from '../../Synchronize/Routes.js'

import StudioStoryProvider from './Providers/StudioStoryProvider.js'
import StudioStageProvider from './Providers/StudioStageProvider.js'
import StudioStoryEditorLayout from './StudioStoryEditorLayout.js'


function StudioStoryEditor({story}) {
  const
    setRoute = useRouter(), 
    closeEditor = useCallback(() => setRoute(routeSynchronize), [setRoute])

  return <StudioStoryProvider storyMetadata={story}>
    <StudioStageProvider>
      <StudioStoryEditorLayout closeEditor={closeEditor}/>
    </StudioStageProvider>
  </StudioStoryProvider>
}

export default StudioStoryEditor