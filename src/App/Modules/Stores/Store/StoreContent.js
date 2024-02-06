import { useCallback, useState } from 'react'
import { useElectronEmitter, useElectronListener } from '../../../Components/Electron/Hooks/UseElectronEvent.js'
import Table from '../../../Components/Table/Table.js'
import { useModal } from '../../../Components/Modal/ModalHooks.js'
import ModalStoreDownload from './ModalStoreDownload.js'

function StoreContent ({store}) {
  const
    [storeStories, setStoreStories] = useState([]),
    {addModal, rmModal} = useModal(),
    onDownload = useCallback(
      (story) => {
        addModal((key) => {
          const modal = <ModalStoreDownload story={story}
                                            onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [addModal, rmModal]
    )

  useElectronListener(
    'store-remote-data',
    (stories) => {setStoreStories(stories)},
    [setStoreStories]
  )
  useElectronEmitter('store-remote-get', [store])

  return <Table titleLeft={storeStories.length + ' histoires sur le store'}
                data={storeStories}
                onDownload={onDownload}/>
}

export default StoreContent
