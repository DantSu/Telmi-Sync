import { useCallback, useState } from 'react'
import { useTelmiOS } from '../../../Components/TelmiOS/TelmiOSHooks.js'
import { useModal } from '../../../Components/Modal/ModalHooks.js'

import StoriesTable from './StoriesTable.js'
import ModalStoriesTransfer from './ModalStoriesTransfer.js'
import TelmiOSLayout from '../TelmiOS/TelmiOSLayout.js'

import styles from '../Synchronize.module.scss'

const {ipcRenderer} = window.require('electron')

function StoriesTelmiOSContent ({selectedLocalStories, setSelectedLocalStories}) {
  const
    {addModal, rmModal} = useModal(),
    telmiOS = useTelmiOS(),
    [selectedTelmiOSStories, setSelectedTelmiOSStories] = useState([]),
    onDelete = useCallback(
      (stories) => ipcRenderer.send('telmios-stories-delete', telmiOS, stories),
      [telmiOS]
    ),
    onTransfer = useCallback(
      () => {
        addModal((key) => {
          const modal = <ModalStoriesTransfer key={key}
                                              stories={selectedLocalStories}
                                              telmiOS={telmiOS}
                                              onClose={() => {
                                                rmModal(modal)
                                                setSelectedLocalStories([])
                                              }}/>
          return modal
        })
      },
      [telmiOS, setSelectedLocalStories, selectedLocalStories, addModal, rmModal]
    )

  return <TelmiOSLayout telmiOS={telmiOS}
                        onTransfer={selectedLocalStories.length ? onTransfer : undefined}>
    <StoriesTable id="stories-telmios"
                  className={styles.telmiOSTable}
                  stories={telmiOS.stories}
                  onDelete={onDelete}
                  setSelectedStories={setSelectedTelmiOSStories}
                  selectedStories={selectedTelmiOSStories}/>
  </TelmiOSLayout>
}

export default StoriesTelmiOSContent
