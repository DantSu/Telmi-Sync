import { useLocale } from '../../../Components/Locale/LocaleHooks.js'
import ModalDialogConfirm from '../../../Components/Modal/Templates/ModalDialogs/ModalDialogConfirm.js'

function ModalMusicDeleteConfirm (props) {
  const {getLocale} = useLocale()

  return <ModalDialogConfirm {...props}
                             title={getLocale('music-delete')}
                             message={getLocale('music-delete-confirm', props.music.title)}/>
}

export default ModalMusicDeleteConfirm
