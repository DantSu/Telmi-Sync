import {useCallback} from 'react'
import {useLocale} from '../../../Components/Locale/LocaleHooks.js'
import {useModal} from '../../../Components/Modal/ModalHooks.js'

import ModalTelmiOSCardMakerForm from './TelmiOSCardMaker/ModalTelmiOSCardMakerForm.js'

import styles from '../Synchronize.module.scss'


function TelmiOSNotDetected() {
  const
    {getLocale} = useLocale(),
    {addModal, rmModal} = useModal(),
    onCreateCard = useCallback(() => {
      addModal((key) => {
        const modal = <ModalTelmiOSCardMakerForm key={key} onClose={() => rmModal(modal)}/>
        return modal
      })
    }, [addModal, rmModal])


  return <div className={styles.telmiOSInactive}>
    <h2 className={styles.telmiOSTitle}>
        <span className={styles.telmiOSTitleText}>
          {getLocale('telmios-not-detected')}
        </span>
    </h2>
    <div className={styles.telmiOSInactiveArea}>
      <button className={styles.telmiOSNewCard} onClick={onCreateCard}>
        <i className={styles.telmiOSNewCardIcon}>{'\uf7c2'}</i>
        <span className={styles.telmiOSNewCardText}>{getLocale('telmios-cardmaker-create')}</span>
      </button>
    </div>
  </div>
}

export default TelmiOSNotDetected
