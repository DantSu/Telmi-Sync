import { useLocale } from '../../../Components/Locale/LocaleHooks.js'
import ModalDialogConfirm from '../../../Components/Modal/Templates/ModalDialogs/ModalDialogConfirm.js'

function ModalStudioStoryCancelConfirm (props) {
  const {getLocale} = useLocale()
  return <ModalDialogConfirm {...props}
                             title={getLocale('studio-story-cancel')}
                             message={getLocale('studio-story-cancel-confirm', props.story.title)}/>
}

export default ModalStudioStoryCancelConfirm
