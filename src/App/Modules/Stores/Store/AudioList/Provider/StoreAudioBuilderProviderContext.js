import {createContext} from 'react'

const StoreAudioBuilderContext = createContext({
  audioList: [],
  setAudioList: (audioList) => {}
})


export default StoreAudioBuilderContext
