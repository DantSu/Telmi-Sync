import { useCallback } from 'react'
import { useModal } from '../../../Components/Modal/ModalHooks.js'
import ButtonIconTrash from '../../../Components/Buttons/Icons/ButtonIconTrash.js'
import ModalDialogConfirm from '../../../Components/Modal/Templates/ModalDialogs/ModalDialogConfirm.js'
import ButtonText from '../../../Components/Buttons/Text/ButtonText.js'

import styles from './Store.module.scss'

const {ipcRenderer} = window.require('electron')

function TabStore ({store, ...props}) {
  const
    {addModal, rmModal} = useModal(),
    onDelete = useCallback(
      () => {
        addModal((key) => {
          const modal = <ModalDialogConfirm key={key}
                                            title="Suppression de store"
                                            message={<>Êtes-vous sûr de vouloir supprimer le
                                              store <strong>"{store.name}"</strong></>}
                                            onClose={() => rmModal(modal)}
                                            onConfirm={() => ipcRenderer.send('store-delete', store)}/>
          return modal
        })
      },
      [addModal, rmModal, store]
    )

  return <>
    <ButtonText {...props} className={styles.tabButton} text={store.name}/>
    <ButtonIconTrash className={styles.trashButton} onClick={onDelete}/>
  </>
}

export default TabStore
