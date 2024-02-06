import { useCallback } from 'react'
import { useModal } from '../Modal/ModalHooks.js'
import ModalDialogAlert from '../Modal/Templates/ModalDialogs/ModalDialogAlert.js'

function Form ({children}) {
  const
    {addModal, rmModal} = useModal(),
    validate = useCallback(
      (inputsRef, onSuccess) => {
        const checkedValues = inputsRef.map((v) => v.current.checkValue()).filter((v) => v !== null)
        if (!checkedValues.length) {
          onSuccess(inputsRef.map((v) => v.current.getValue()))
        } else {
          addModal(
            (key) => {
              const modal = <ModalDialogAlert key={key}
                                              title="Une erreur est survenue !"
                                              message={checkedValues}
                                              onClose={() => rmModal(modal)}/>
              return modal
            }
          )
        }
      },
      [addModal, rmModal]
    )

  return <form onSubmit={(e) => {e.preventDefault()}} noValidate={true}>{
    children(validate)
  }</form>
}

export default Form
