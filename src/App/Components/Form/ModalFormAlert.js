import { useLocale } from '../Locale/LocaleHooks.js'
import ModalDialogAlert from '../Modal/Templates/ModalDialogs/ModalDialogAlert.js'

function ModalFormAlert (props) {
  const {getLocale} = useLocale()
  return <ModalDialogAlert {...props}
                           title={getLocale('error-occurred')}/>
}

export default ModalFormAlert
