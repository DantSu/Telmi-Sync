import {useState} from 'react'
import {useElectronEmitter, useElectronListener} from '../../../Components/Electron/Hooks/UseElectronEvent.js'

import ModalPlayer from './ModalPlayer.js'


function ModalPlayerLauncher({storyMetadata, onClose}) {
  const [story, setStory] = useState(null)

  useElectronListener('studio-story-data', (sd) => setStory(sd), [])
  useElectronEmitter('studio-story-get', [storyMetadata])

  return story === null ? null : <ModalPlayer story={story} onClose={onClose}/>
}

export default ModalPlayerLauncher