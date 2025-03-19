import {useLocale} from '../../../../../Components/Locale/LocaleHooks.js'
import ModalDialogAlert from '../../../../../Components/Modal/Templates/ModalDialogs/ModalDialogAlert.js'

function ModalStudioInventoryDeleteError({stages, onClose}) {
  const {getLocale} = useLocale()
  return <ModalDialogAlert title={getLocale('studio-inventory-delete-error')}
                           message={getLocale('studio-inventory-delete-error-message', '- ' + stages.join('<br />- '))}
                           onClose={onClose}/>
}

export default ModalStudioInventoryDeleteError
