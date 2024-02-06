import { useContext } from 'react'
import ModalContext from './ModalContext.js'

const useModal = () => useContext(ModalContext)

export { useModal }
