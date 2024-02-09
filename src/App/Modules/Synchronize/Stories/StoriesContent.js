import { useState } from 'react'
import StoriesUsbContent from './StoriesUsbContent.js'
import StoriesLocalContent from './StoriesLocalContent.js'
function StoriesContent () {
  const [selectedLocalStories, setSelectedLocalStories] = useState([])

  return <>
    <StoriesUsbContent setSelectedLocalStories={setSelectedLocalStories}
                       selectedLocalStories={selectedLocalStories}/>
    <StoriesLocalContent setSelectedStories={setSelectedLocalStories}
                         selectedStories={selectedLocalStories}/>
  </>
}

export default StoriesContent
