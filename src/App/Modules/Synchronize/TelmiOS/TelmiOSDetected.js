import { useCallback } from 'react'
import { useLocale } from '../../../Components/Locale/LocaleHooks.js'
import { useModal } from '../../../Components/Modal/ModalHooks.js'
import ButtonIconAnglesLeft from '../../../Components/Buttons/Icons/ButtonIconAnglesLeft.js'
import ButtonIconGear from '../../../Components/Buttons/Icons/ButtonIconGear.js'
import ModalTelmiOSParamsForm from './ModalTelmiOSParamsForm.js'

import styles from '../Synchronize.module.scss'

const {ipcRenderer} = window.require('electron')

function TelmiOSDetected ({usb, onTransfer, children}) {
  const
    {getLocale} = useLocale(),
    {addModal, rmModal} = useModal(),
    onTelmiOSParams = useCallback(
      () => {
        addModal(
          (key) => {
            const modal = <ModalTelmiOSParamsForm key={key}
                                                  parameters={usb.telmiOS.parameters}
                                                  onValidate={(params) => {
                                                    usb.telmiOS.parameters = params
                                                    ipcRenderer.send('usb-save-parameters', usb)
                                                  }}
                                                  onClose={() => rmModal(modal)}/>
            return modal
          }
        )
      },
      [usb, addModal, rmModal]
    )

  return <>
    <div className={styles.telmiOS}>
      <h2 className={styles.usbTitle}>
        <span
          className={styles.usbTitleText}>{usb.telmiOS.label + ' v' + usb.telmiOS.version.major + '.' + usb.telmiOS.version.minor + '.' + usb.telmiOS.version.fix}</span>
        <span className={styles.usbTitleIcons}>
            <ButtonIconGear className={styles.usbTitleIcon}
                            title={getLocale('telmios-parameters')}
                            onClick={onTelmiOSParams}/>
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
