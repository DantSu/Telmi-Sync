import {useLocale} from '../../../../Components/Locale/LocaleHooks.js'
import {useModal} from '../../../../Components/Modal/ModalHooks.js'

import ModalDialogConfirm from '../../../../Components/Modal/Templates/ModalDialogs/ModalDialogConfirm.js'
import ModalTelmiOSCardMakerTask from './ModalTelmiOSCardMakerTask.js'

function ModalTelmiOSCardMakerConfirm({drive, onClose}) {
  const
    {getLocale} = useLocale(),
    {addModal, rmModal} = useModal()

  return <ModalDialogConfirm title={getLocale('telmios-cardmaker-alert', drive.drive)}
                             message={getLocale('telmios-cardmaker-alert-message', '<strong>' + drive.drive + ' (' + drive.name + ')</strong>')}
                             onConfirm={() => {
                               addModal((key) => {
                                 const modal = <ModalTelmiOSCardMakerTask key={key}
                                                                          drive={drive}
                                                                          onClose={() => rmModal(modal)}/>
                                 return modal
                               })
                             }}
                             onClose={onClose}/>

}

export default ModalTelmiOSCardMakerConfirm