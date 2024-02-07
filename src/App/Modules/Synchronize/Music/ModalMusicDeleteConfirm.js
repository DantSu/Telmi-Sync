import ModalDialogConfirm from '../../../Components/Modal/Templates/ModalDialogs/ModalDialogConfirm.js'

function ModalMusicDeleteConfirm (props) {
  return <ModalDialogConfirm {...props}
                             title="Suppression de musique"
                             message={<>
                               Êtes-vous sûr de vouloir supprimer la musique
                               <strong>"{props.music.title}"</strong> ?
                             </>}/>
}

export default ModalMusicDeleteConfirm
