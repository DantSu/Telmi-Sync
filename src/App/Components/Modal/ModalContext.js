import { createContext } from 'react'

const ModalContext = createContext({
  addModal: (modal) => {},
  rmModal: (modal) => {}
})


export default ModalContext
