import {useElectronListener} from '../Electron/Hooks/UseElectronEvent.js'
import {useModal} from '../Modal/ModalHooks.js'
import ModalDialogAlertLocale from '../Modal/Templates/ModalDialogs/ModalDialogAlertLocale.js'

function ErrorListener({children}) {
  const {addModal, rmModal} = useModal()
  useElectronListener('error-warning',
    (message) => addModal(key => {
      const modal = <ModalDialogAlertLocale key={key}
                                            title={message.title}
                                            message={message.message}
                                            onClose={() => rmModal(modal)}/>
      return modal
    }),
    []
  )

  return children
}

export default ErrorListener