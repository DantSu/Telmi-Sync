import { useLocale } from '../../../Components/Locale/LocaleHooks.js'
import ModalDialogConfirm from '../../../Components/Modal/Templates/ModalDialogs/ModalDialogConfirm.js'

function ModalStoriesDeleteConfirm (props) {
  const {getLocale} = useLocale()
  return <ModalDialogConfirm {...props}
                             title={getLocale('stories-delete')}
                             message={getLocale('stories-delete-confirm')}/>
}

export default ModalStoriesDeleteConfirm
