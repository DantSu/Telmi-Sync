import ModalDialogConfirm from '../../../Components/Modal/Templates/ModalDialogs/ModalDialogConfirm.js'

function ModalMusicsDeleteConfirm (props) {
  return <ModalDialogConfirm {...props}
                             title="Suppression de musiques"
                             message="Êtes-vous sûr de vouloir supprimer les musiques sélectionnées ?"/>
}

export default ModalMusicsDeleteConfirm
