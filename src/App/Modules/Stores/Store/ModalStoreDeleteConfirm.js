import { useLocale } from '../../../Components/Locale/LocaleHooks.js'
import ModalDialogConfirm from '../../../Components/Modal/Templates/ModalDialogs/ModalDialogConfirm.js'

function ModalStoreDeleteConfirm (props) {
  const {getLocale} = useLocale()

  return <ModalDialogConfirm {...props}
                             title={getLocale('store-delete')}
                             message={getLocale('store-delete-confirm', props.store.name)}/>
}

export default ModalStoreDeleteConfirm
