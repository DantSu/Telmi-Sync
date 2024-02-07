import { useState } from 'react'
import { useElectronEmitter, useElectronListener } from '../Electron/Hooks/UseElectronEvent.js'
import LocalMusicContext from './LocalMusicContext.js'

function LocalMusicProvider ({children}) {
  const [music, setMusic] = useState([])

  useElectronListener('local-musics-data', (music) => setMusic(music), [setMusic])
  useElectronEmitter('local-musics-get', [])

  return <LocalMusicContext.Provider value={{music}}>{children}</LocalMusicContext.Provider>
}

export default LocalMusicProvider
