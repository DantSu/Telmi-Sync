import { useCallback, useState } from 'react'
import { useUsb } from '../../../Components/Usb/UsbHooks.js'
import { useModal } from '../../../Components/Modal/ModalHooks.js'
import { useElectronEmitter, useElectronListener } from '../../../Components/Electron/Hooks/UseElectronEvent.js'

import TelmiOSLayout from '../TelmiOS/TelmiOSLayout.js'
import MusicTable from './MusicTable.js'
import ModalMusicTransfer from './ModalMusicTransfer.js'

import styles from '../Synchronize.module.scss'

const {ipcRenderer} = window.require('electron')

function MusicUsbContent ({selectedLocalMusics, setSelectedLocalMusics}) {
  const
    {addModal, rmModal} = useModal(),
    usb = useUsb(),
    [musics, setMusics] = useState([]),
    [selectedUsbMusics, setSelectedUsbMusics] = useState([]),
    onDelete = useCallback(
      (musicsIds) => ipcRenderer.send('usb-musics-delete', usb, musicsIds),
      [usb]
    ),
    onTransfer = useCallback(
      () => {
        addModal((key) => {
          const modal = <ModalMusicTransfer key={key}
                                            musics={selectedLocalMusics}
                                            usb={usb}
                                            onClose={() => {
                                              rmModal(modal)
                                              setSelectedLocalMusics([])
                                            }}/>
          return modal
        })
      },
      [usb, selectedLocalMusics, setSelectedLocalMusics, addModal, rmModal]
    )

  useElectronListener('usb-musics-data', (usbMusics) => setMusics(usbMusics), [setMusics])
  useElectronEmitter('usb-musics-get', [usb])

  return <TelmiOSLayout usb={usb}
                        onTransfer={selectedLocalMusics.length ? onTransfer : undefined}>
    <MusicTable className={styles.usbTable}
                musics={musics}
                onDelete={onDelete}
                selectedMusics={selectedUsbMusics}
                setSelectedMusics={setSelectedUsbMusics}/>
  </TelmiOSLayout>
}

export default MusicUsbContent
