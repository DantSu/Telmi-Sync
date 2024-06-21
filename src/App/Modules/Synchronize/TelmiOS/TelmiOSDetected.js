import { useCallback } from 'react'
import { useLocale } from '../../../Components/Locale/LocaleHooks.js'
import { useModal } from '../../../Components/Modal/ModalHooks.js'
import ButtonIconAnglesLeft from '../../../Components/Buttons/Icons/ButtonIconAnglesLeft.js'
import ButtonIconGear from '../../../Components/Buttons/Icons/ButtonIconGear.js'
import ButtonIconEject from '../../../Components/Buttons/Icons/ButtonIconEject.js'
import ModalTelmiOSParamsForm from './ModalTelmiOSParamsForm.js'

import styles from '../Synchronize.module.scss'
import ModalTelmiOSEject from './ModalTelmiOSEject.js'

const
  {ipcRenderer} = window.require('electron'),
  bytesToGigabytes = (byteCount) => (byteCount / 1073741824).toFixed(1)

function TelmiOSDetected ({telmiOS, onTransfer, children}) {
  const
    {getLocale} = useLocale(),
    {addModal, rmModal} = useModal(),
    onTelmiOSParams = useCallback(
      () => {
        addModal(
          (key) => {
            const modal = <ModalTelmiOSParamsForm key={key}
                                                  parameters={telmiOS.telmiOS.parameters}
                                                  onValidate={(params) => {
                                                    telmiOS.telmiOS.parameters = params
                                                    ipcRenderer.send('telmios-save-parameters', telmiOS)
                                                  }}
                                                  onClose={() => rmModal(modal)}/>
            return modal
          }
        )
      },
      [telmiOS, addModal, rmModal]
    ),
    onTelmiOSEject = useCallback(
      () => {
        addModal(
          (key) => {
            const modal = <ModalTelmiOSEject key={key}
                                             telmiOS={telmiOS}
                                             onClose={() => rmModal(modal)}/>
            return modal
          }
        )
      },
      [telmiOS, addModal, rmModal]
    )

  return <>
    <div className={styles.telmiOS}>
      <h2 className={styles.telmiOSTitle}>
        <span className={styles.telmiOSTitleText}>
          {telmiOS.telmiOS.label + ' v' + telmiOS.telmiOS.version.major + '.' + telmiOS.telmiOS.version.minor + '.' + telmiOS.telmiOS.version.fix}
          {
            telmiOS.diskusage !== null &&
            <span className={styles.telmiOSTitleFreeSpace}>
              ({getLocale('avail')} : {bytesToGigabytes(telmiOS.diskusage.available)}Go / {bytesToGigabytes(telmiOS.diskusage.total)}Go)
            </span>
          }
        </span>
        <span className={styles.telmiOSTitleIcons}>
            <ButtonIconGear className={styles.telmiOSTitleIcon}
                            title={getLocale('telmios-parameters')}
                            onClick={onTelmiOSParams}/>
            <ButtonIconEject className={styles.telmiOSTitleIcon}
                             title={getLocale('telmios-eject')}
                             onClick={onTelmiOSEject}/>
          </span>
      </h2>
      {children}
    </div>
    {
      onTransfer &&
      <ButtonIconAnglesLeft className={styles.buttonTransfer}
                            title={getLocale('transfer-files')}
                            onClick={onTransfer}/>
    }
  </>
}

export default TelmiOSDetected
