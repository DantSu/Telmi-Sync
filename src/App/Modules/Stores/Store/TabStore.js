import { useCallback } from 'react'
import { useModal } from '../../../Components/Modal/ModalHooks.js'
import ButtonIconTrash from '../../../Components/Buttons/Icons/ButtonIconTrash.js'
import ButtonText from '../../../Components/Buttons/Text/ButtonText.js'
import ModalStoreDeleteConfirm from './ModalStoreDeleteConfirm.js'

import styles from './Store.module.scss'

const {ipcRenderer} = window.require('electron')

function TabStore ({store, ...props}) {
  const
    {addModal, rmModal} = useModal(),
    onDelete = useCallback(
      () => {
        addModal((key) => {
          const modal = <ModalStoreDeleteConfirm key={key}
                                                 store={store}
                                                 onClose={() => rmModal(modal)}
                                                 onConfirm={() => ipcRenderer.send('store-delete', store)}/>
          return modal
        })
      },
      [addModal, rmModal, store]
    )

  return <>
    <ButtonText {...props} className={styles.tabButton} text={store.name}/>
    {store.deletable && <ButtonIconTrash className={styles.trashButton} onClick={onDelete}/>}
  </>
}

export default TabStore
