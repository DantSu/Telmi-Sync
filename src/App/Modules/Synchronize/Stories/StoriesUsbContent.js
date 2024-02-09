import { useCallback, useState } from 'react'
import { useUsb } from '../../../Components/Usb/UsbHooks.js'
import { useModal } from '../../../Components/Modal/ModalHooks.js'
import { useElectronEmitter, useElectronListener } from '../../../Components/Electron/Hooks/UseElectronEvent.js'

import StoriesTable from './StoriesTable.js'
import ModalStoriesTransfer from './ModalStoriesTransfer.js'
import TelmiOSLayout from '../TelmiOS/TelmiOSLayout.js'

import styles from '../Synchronize.module.scss'

const {ipcRenderer} = window.require('electron')

function StoriesUsbContent ({selectedLocalStories, setSelectedLocalStories}) {
  const
    {addModal, rmModal} = useModal(),
    usb = useUsb(),
    [usbStories, setUsbStories] = useState([]),
    [selectedUsbStories, setSelectedUsbStories] = useState([]),
    onDelete = useCallback(
      (stories) => ipcRenderer.send('usb-stories-delete', usb, stories),
      [usb]
    ),
    onTransfer = useCallback(
      () => {
        addModal((key) => {
          const modal = <ModalStoriesTransfer key={key}
                                              stories={selectedLocalStories}
                                              usb={usb}
                                              onClose={() => {
                                                rmModal(modal)
                                                setSelectedLocalStories([])
                                              }}/>
          return modal
        })
      },
      [usb, setSelectedLocalStories, selectedLocalStories, addModal, rmModal]
    )

  useElectronListener('usb-stories-data', (usbStories) => setUsbStories(usbStories), [setUsbStories])
  useElectronEmitter('usb-stories-get', [usb])

  return <TelmiOSLayout usb={usb}
                        onTransfer={selectedLocalStories.length ? onTransfer : undefined}>
    <StoriesTable className={styles.usbTable}
                  stories={usbStories}
                  onDelete={onDelete}
                  setSelectedStories={setSelectedUsbStories}
                  selectedStories={selectedUsbStories}/>
  </TelmiOSLayout>
}

export default StoriesUsbContent
