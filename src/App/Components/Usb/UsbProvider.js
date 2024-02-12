import { useEffect, useState } from 'react'
import { useElectronListener } from '../Electron/Hooks/UseElectronEvent.js'
import UsbContext from './UsbContext.js'
import { useModal } from '../Modal/ModalHooks.js'
import ModalElectronTaskVisualizer from '../Electron/Modal/ModalElectronTaskVisualizer.js'

const usbToString = (usb) => {
  return usb === null ?
    '' :
    usb.drive + '_' + usb.telmiOS.label + '-v' + usb.telmiOS.version.major + '.' + usb.telmiOS.version.minor + '.' + usb.telmiOS.version.fix
}

function UsbProvider ({children}) {
  const
    [usb, setUsb] = useState(null),
    {addModal, rmModal} = useModal()

  useElectronListener(
    'usb-data',
    (u) => {
      if (usbToString(u) !== usbToString(usb)) {
        setUsb(u)
      }
    },
    [setUsb, usb]
  )

  useEffect(
    () => {
      if (usb !== null) {
        addModal((key) => {
          const modal = <ModalElectronTaskVisualizer key={key}
                                                     taskName="usb-update-telmios"
                                                     dataSent={[usb]}
                                                     onClose={() => rmModal(modal)}/>
          return modal
        })
      }
    },
    [usb, addModal, rmModal]
  )

  return <UsbContext.Provider value={usb}>{children}</UsbContext.Provider>
}

export default UsbProvider
