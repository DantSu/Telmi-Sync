import { useLocale } from '../../../Locale/LocaleHooks.js'
import ModalDialogAlert from './ModalDialogAlert.js'


function ModalDialogAlertLocale ({title, message, onClose}) {
  const {getLocale} = useLocale()
  return <ModalDialogAlert title={getLocale(title)} message={getLocale(message)} onClose={onClose} />
}

export default ModalDialogAlertLocale
