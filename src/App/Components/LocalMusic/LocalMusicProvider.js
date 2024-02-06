import { useState } from 'react'
import { useElectronEmitter, useElectronListener } from '../Electron/Hooks/UseElectronEvent.js'
import LocalMusicContext from './LocalMusicContext.js'

function LocalMusicProvider ({children}) {
  const [music, setMusic] = useState([])

  useElectronListener('local-music-data', (music) => setMusic(music), [setMusic])
  useElectronEmitter('local-music-get', [])

  return <LocalMusicContext.Provider value={{music}}>{children}</LocalMusicContext.Provider>
}

export default LocalMusicProvider
