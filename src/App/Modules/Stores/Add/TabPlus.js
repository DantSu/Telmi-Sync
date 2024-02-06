import ButtonIconPlus from '../../../Components/Buttons/Icons/ButtonIconPlus.js'
import { useCallback } from 'react'
import { useModal } from '../../../Components/Modal/ModalHooks.js'
import ModalStoreFormAdd from './ModalStoreFormAdd.js'

import styles from './StoreAdd.module.scss'

const {ipcRenderer} = window.require('electron')

function TabPlus () {
  const
    {addModal, rmModal} = useModal(),
    onCLick = useCallback(
      () => {
        addModal((key) => {
          const modal = <ModalStoreFormAdd key={key}
                                           onClose={() => rmModal(modal)}
                                           onValidate={(store) => ipcRenderer.send('store-add', store)}/>
          return modal
        })
      },
      [addModal, rmModal]
    )

  return <ButtonIconPlus className={styles.plusButton} onClick={onCLick}/>
}

export default TabPlus
