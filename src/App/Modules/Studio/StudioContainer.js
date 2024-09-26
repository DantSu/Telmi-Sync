import {useState} from 'react'
import StudioStoriesTable from './Stories/StoriesTable.js'
import StudioStoryEditor from './Editor/StudioStoryEditor.js'

function StudioContainer({openedStory}) {
  const [story, setStory] = useState(openedStory || null)
  if (story === null) {
    return <StudioStoriesTable setStory={setStory}/>
  } else {
    return <StudioStoryEditor story={story} setStory={setStory}/>
  }
}

export default StudioContainer