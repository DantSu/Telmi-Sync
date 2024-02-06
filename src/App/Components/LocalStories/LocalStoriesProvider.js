import { useState } from 'react'
import { useElectronEmitter, useElectronListener } from '../Electron/Hooks/UseElectronEvent.js'
import LocalStoriesContext from './LocalStoriesContext.js'

function LocalStoriesProvider ({children}) {
  const [stories, setStories] = useState([])

  useElectronListener('local-stories-data', (stories) => setStories(stories), [setStories])
  useElectronEmitter('local-stories-get', [])

  return <LocalStoriesContext.Provider value={{stories}}>{children}</LocalStoriesContext.Provider>
}

export default LocalStoriesProvider
