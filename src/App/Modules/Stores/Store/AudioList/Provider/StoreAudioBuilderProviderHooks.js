import { useContext } from 'react'
import StoreAudioBuilderProviderContext from './StoreAudioBuilderProviderContext.js'

const useStoreAudioBuilder = () => useContext(StoreAudioBuilderProviderContext)

export { useStoreAudioBuilder }
