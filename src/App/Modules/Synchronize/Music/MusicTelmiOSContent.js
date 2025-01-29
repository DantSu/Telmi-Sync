import {useCallback, useState} from 'react'
import {useTelmiOS} from '../../../Components/TelmiOS/TelmiOSHooks.js'
import {useModal} from '../../../Components/Modal/ModalHooks.js'

import TelmiOSLayout from '../TelmiOS/TelmiOSLayout.js'
import MusicTable from './MusicTable.js'
import ModalMusicTransfer from './ModalMusicTransfer.js'

import styles from '../Synchronize.module.scss'

const {ipcRenderer} = window.require('electron')

function MusicTelmiOSContent({selectedLocalMusics, setSelectedLocalMusics}) {
  const
    {addModal, rmModal} = useModal(),
    telmiOS = useTelmiOS(),
    [selectedTelmiOSMusics, setSelectedTelmiOSMusics] = useState([]),
    onDelete = useCallback(
      (musicsIds) => ipcRenderer.send('telmios-musics-delete', telmiOS, musicsIds),
      [telmiOS]
    ),
    onTransfer = useCallback(
      () => {
        addModal((key) => {
          const modal = <ModalMusicTransfer key={key}
                                            musics={selectedLocalMusics}
                                            telmiOS={telmiOS}
                                            onClose={() => {
                                              rmModal(modal)
                                              setSelectedLocalMusics([])
                                            }}/>
          return modal
        })
      },
      [telmiOS, selectedLocalMusics, setSelectedLocalMusics, addModal, rmModal]
    )

  return <TelmiOSLayout telmiOS={telmiOS}
                        onTransfer={selectedLocalMusics.length ? onTransfer : undefined}>
    <MusicTable id="music-telmios"
                className={styles.telmiOSTable}
                musics={telmiOS.music}
                onDelete={onDelete}
                selectedMusics={selectedTelmiOSMusics}
                setSelectedMusics={setSelectedTelmiOSMusics}/>
  </TelmiOSLayout>
}

export default MusicTelmiOSContent
