import ModalContext from './ModalContext.js'
import { useMemo, useState } from 'react'

function ModalProvider ({children}) {
  const
    [modals, setModals] = useState([]),
    value = useMemo(
      () => ({
        addModal: modal => setModals(modals => [...modals, modal('modal-' + modals.length)]),
        rmModal: modal => setModals(modals => modals.filter(m => m !== modal))
      }),
      [setModals]
    )

  return <ModalContext.Provider value={value}>
    {children}
    {modals}
  </ModalContext.Provider>
}

export default ModalProvider
