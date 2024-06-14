import StudioStoriesTable from './Stories/StoriesTable.js'
import {useState} from 'react'
import StudioStoryEditor from './Editor/StoryEditor.js'

function StudioContainer() {
  const [story, setStory] = useState(null)
  if(story === null) {
  return <StudioStoriesTable setStory={setStory}/>
  } else {
    return <StudioStoryEditor story={story} setStory={setStory}/>
  }
}

export default StudioContainer