import ModalDialogConfirm from '../../../Components/Modal/Templates/ModalDialogs/ModalDialogConfirm.js'

function ModalStoriesDeleteConfirm (props) {
  return <ModalDialogConfirm {...props}
                             title="Suppression d'histoires"
                             message="Êtes-vous sûr de vouloir supprimer les histoires sélectionnées ?"/>
}

export default ModalStoriesDeleteConfirm
