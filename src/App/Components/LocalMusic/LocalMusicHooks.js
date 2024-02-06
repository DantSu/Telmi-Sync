import { useContext } from 'react'
import LocalMusicContext from './LocalMusicContext.js'

const useLocalMusic = () => useContext(LocalMusicContext).music

export { useLocalMusic }
