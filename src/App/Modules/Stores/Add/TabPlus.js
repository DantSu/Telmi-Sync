import { useCallback } from 'react'
import { useLocale } from '../../../Components/Locale/LocaleHooks.js'
import { useModal } from '../../../Components/Modal/ModalHooks.js'
import ButtonIconPlus from '../../../Components/Buttons/Icons/ButtonIconPlus.js'
import ModalStoreFormAdd from './ModalStoreFormAdd.js'

import styles from './StoreAdd.module.scss'

const {ipcRenderer} = window.require('electron')

function TabPlus () {
  const
    {getLocale} = useLocale(),
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

  return <ButtonIconPlus className={styles.plusButton} onClick={onCLick} title={getLocale('store-add')}/>
}

export default TabPlus
