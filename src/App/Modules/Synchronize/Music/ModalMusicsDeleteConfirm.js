import { useLocale } from '../../../Components/Locale/LocaleHooks.js'
import ModalDialogConfirm from '../../../Components/Modal/Templates/ModalDialogs/ModalDialogConfirm.js'

function ModalMusicsDeleteConfirm (props) {

  const {getLocale} = useLocale()

  return <ModalDialogConfirm {...props}
                             title={getLocale('musics-delete')}
                             message={getLocale('musics-delete-confirm')}/>
}

export default ModalMusicsDeleteConfirm
