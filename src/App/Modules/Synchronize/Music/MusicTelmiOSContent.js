import { useCallback, useState } from 'react'
import { useTelmiOS } from '../../../Components/TelmiOS/TelmiOSHooks.js'
import { useModal } from '../../../Components/Modal/ModalHooks.js'

import TelmiOSLayout from '../TelmiOS/TelmiOSLayout.js'
import MusicTable from './MusicTable.js'
import ModalMusicTransfer from './ModalMusicTransfer.js'

import styles from '../Synchronize.module.scss'

const {ipcRenderer} = window.require('electron')

function MusicTelmiOSContent ({selectedLocalMusics, setSelectedLocalMusics}) {
  const
    {addModal, rmModal} = useModal(),
    telmiOS = useTelmiOS(),
    [selectedUsbMusics, setSelectedUsbMusics] = useState([]),
    onDelete = useCallback(
      (musicsIds) => ipcRenderer.send('telmios-musics-delete', telmiOS, musicsIds),
      [telmiOS]
    ),
    onTransfer = useCallback(
      () => {
        addModal((key) => {
          const modal = <ModalMusicTransfer key={key}
                                            musics={selectedLocalMusics}
                                            usb={telmiOS}
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
    <MusicTable className={styles.usbTable}
                musics={telmiOS.music}
                onDelete={onDelete}
                selectedMusics={selectedUsbMusics}
                setSelectedMusics={setSelectedUsbMusics}/>
  </TelmiOSLayout>
}

export default MusicTelmiOSContent
