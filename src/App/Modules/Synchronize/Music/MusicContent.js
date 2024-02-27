import { useState } from 'react'
import MusicTelmiOSContent from './MusicTelmiOSContent.js'
import MusicLocalContent from './MusicLocalContent.js'

function MusicContent () {
  const [selectedLocalMusics, setSelectedLocalMusics] = useState([])

  return <>
    <MusicTelmiOSContent setSelectedLocalMusics={setSelectedLocalMusics}
                         selectedLocalMusics={selectedLocalMusics} />
    <MusicLocalContent setSelectedMusics={setSelectedLocalMusics}
                       selectedMusics={selectedLocalMusics}/>
  </>
}

export default MusicContent
