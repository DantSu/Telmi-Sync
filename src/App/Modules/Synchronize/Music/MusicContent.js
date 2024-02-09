import { useState } from 'react'
import MusicUsbContent from './MusicUsbContent.js'
import MusicLocalContent from './MusicLocalContent.js'

function MusicContent () {
  const [selectedLocalMusics, setSelectedLocalMusics] = useState([])

  return <>
    <MusicUsbContent setSelectedLocalMusics={setSelectedLocalMusics}
                     selectedLocalMusics={selectedLocalMusics} />
    <MusicLocalContent setSelectedMusics={setSelectedLocalMusics}
                       selectedMusics={selectedLocalMusics}/>
  </>
}

export default MusicContent
