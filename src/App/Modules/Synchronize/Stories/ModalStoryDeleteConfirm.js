import ModalDialogConfirm from '../../../Components/Modal/Templates/ModalDialogs/ModalDialogConfirm.js'

function ModalStoryDeleteConfirm (props) {
  return <ModalDialogConfirm {...props}
                             title="Suppression d'histoire"
                             message={<>Êtes-vous sûr de vouloir supprimer
                               l'histoire <strong>"{props.story.title}"</strong> ?</>}/>
}

export default ModalStoryDeleteConfirm
