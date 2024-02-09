import { useState } from 'react'
import { useElectronListener } from '../Electron/Hooks/UseElectronEvent.js'
import UsbContext from './UsbContext.js'

function UsbProvider ({children}) {
  const [usb, setUsb] = useState(null)

  useElectronListener(
    'usb-data',
    (u) => {
      if (JSON.stringify(u) !== JSON.stringify(usb)) {
        setUsb(u)
      }
    },
    [setUsb, usb]
  )
  return <UsbContext.Provider value={usb}>{children}</UsbContext.Provider>
}

export default UsbProvider
