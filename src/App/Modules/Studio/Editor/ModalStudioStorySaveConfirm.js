import { useLocale } from '../../../Components/Locale/LocaleHooks.js'
import ModalDialogConfirm from '../../../Components/Modal/Templates/ModalDialogs/ModalDialogConfirm.js'

function ModalStudioStorySaveConfirm (props) {
  const {getLocale} = useLocale()
  return <ModalDialogConfirm {...props}
                             title={getLocale('studio-story-save')}
                             message={getLocale('studio-story-save-confirm', props.story.title)}/>
}

export default ModalStudioStorySaveConfirm
