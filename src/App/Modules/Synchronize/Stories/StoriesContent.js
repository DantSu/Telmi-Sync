import { useState } from 'react'
import StoriesTelmiOSContent from './StoriesTelmiOSContent.js'
import StoriesLocalContent from './StoriesLocalContent.js'
function StoriesContent () {
  const [selectedLocalStories, setSelectedLocalStories] = useState([])

  return <>
    <StoriesTelmiOSContent setSelectedLocalStories={setSelectedLocalStories}
                           selectedLocalStories={selectedLocalStories}/>
    <StoriesLocalContent setSelectedStories={setSelectedLocalStories}
                         selectedStories={selectedLocalStories}/>
  </>
}

export default StoriesContent
