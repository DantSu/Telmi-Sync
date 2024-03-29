import { useLocale } from '../../../Components/Locale/LocaleHooks.js'
import ModalDialogConfirm from '../../../Components/Modal/Templates/ModalDialogs/ModalDialogConfirm.js'

function ModalStoryDeleteConfirm (props) {
  const {getLocale} = useLocale()
  return <ModalDialogConfirm {...props}
                             title={getLocale('story-delete')}
                             message={getLocale('story-delete-confirm', props.story.title)}/>
}

export default ModalStoryDeleteConfirm
