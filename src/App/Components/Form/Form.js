import { useCallback } from 'react'
import { useModal } from '../Modal/ModalHooks.js'
import ModalFormAlert from './ModalFormAlert.js'

function Form ({children, ...props}) {
  const
    {addModal, rmModal} = useModal(),
    validate = useCallback(
      (inputsRef, onSuccess) => {
        const checkedValues = inputsRef.map((v) => typeof v.current === 'object' && v.current !== null ? v.current.checkValue() : null).filter((v) => v !== null)
        if (!checkedValues.length) {
          onSuccess(inputsRef.map((v) => typeof v.current === 'object' && v.current !== null ? v.current.getValue() : undefined))
        } else {
          addModal(
            (key) => {
              const modal = <ModalFormAlert key={key}
                                            message={checkedValues.join('<br />')}
                                            onClose={() => rmModal(modal)}/>
              return modal
            }
          )
        }
      },
      [addModal, rmModal]
    )

  return <form{...props} onSubmit={(e) => {e.preventDefault()}} noValidate={true}>{
    children(validate)
  }</form>
}

export default Form
