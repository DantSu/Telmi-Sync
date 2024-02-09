import { useContext } from 'react'
import UsbContext from './UsbContext.js'

const useUsb = () => useContext(UsbContext)

export { useUsb }
