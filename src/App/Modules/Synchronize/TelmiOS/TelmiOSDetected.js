import { useCallback } from 'react'
import { useLocale } from '../../../Components/Locale/LocaleHooks.js'
import { useModal } from '../../../Components/Modal/ModalHooks.js'
import ButtonIconAnglesLeft from '../../../Components/Buttons/Icons/ButtonIconAnglesLeft.js'
import ButtonIconGear from '../../../Components/Buttons/Icons/ButtonIconGear.js'
import ModalTelmiOSParamsForm from './ModalTelmiOSParamsForm.js'

import styles from '../Synchronize.module.scss'
import ButtonIconEject from '../../../Components/Buttons/Icons/ButtonIconEject.js'

const
  {ipcRenderer} = window.require('electron'),
  bytesToGigabytes = (byteCount) => {
    return (byteCount / 1073741824).toFixed(1)
  }



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
    ),
    onTelmiOSEject = useCallback(
      () => ipcRenderer.send('usb-eject-telmios', usb),
      [usb]
    )

  return <>
    <div className={styles.telmiOS}>
      <h2 className={styles.usbTitle}>
        <span
          className={styles.usbTitleText}>
          {usb.telmiOS.label + ' v' + usb.telmiOS.version.major + '.' + usb.telmiOS.version.minor + '.' + usb.telmiOS.version.fix}
          <span className={styles.usbTitleFreeSpace}>({getLocale('avail')} : {bytesToGigabytes(usb.diskusage.available)}Go / {bytesToGigabytes(usb.diskusage.total)}Go)</span>
        </span>
        <span className={styles.usbTitleIcons}>
            <ButtonIconGear className={styles.usbTitleIcon}
                            title={getLocale('telmios-parameters')}
                            onClick={onTelmiOSParams}/>
            <ButtonIconEject className={styles.usbTitleIcon}
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
