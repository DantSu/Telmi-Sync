import { useLocale } from '../../../Components/Locale/LocaleHooks.js'
import ModalDialogConfirm from '../../../Components/Modal/Templates/ModalDialogs/ModalDialogConfirm.js'

function ModalStudioStorySaveConfirm (props) {
  const {getLocale} = useLocale()
  return <ModalDialogConfirm {...props}
                             title={getLocale('studio-story-unsaved')}
                             message={getLocale('studio-story-unsaved-confirm')}/>
}

export default ModalStudioStorySaveConfirm
