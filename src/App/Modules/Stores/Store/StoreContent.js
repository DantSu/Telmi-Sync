import {useState} from 'react'
import {useElectronEmitter, useElectronListener} from '../../../Components/Electron/Hooks/UseElectronEvent.js'
import StoreAudioListContent from './AudioList/StoreAudioListContent.js'
import StorePacksListContent from './PacksList/StorePacksListContent.js'

function StoreContent({store}) {
  const [storeData, setStoreData] = useState(null)

  useElectronListener('store-remote-data', (response) => setStoreData(response), [])
  useElectronEmitter('store-remote-get', [store])

  return storeData !== null && storeData.audioList ?
    <StoreAudioListContent store={store} storeData={storeData}/> :
    <StorePacksListContent store={store} storeData={storeData}/>
}

export default StoreContent
