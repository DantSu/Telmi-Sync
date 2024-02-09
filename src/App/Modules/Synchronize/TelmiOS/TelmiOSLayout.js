import { useLocale } from '../../../Components/Locale/LocaleHooks.js'
import ButtonIconAnglesLeft from '../../../Components/Buttons/Icons/ButtonIconAnglesLeft.js'

import styles from '../Synchronize.module.scss'

function TelmiOSLayout ({usb, onTransfer, children}) {
  const {getLocale} = useLocale()

  if (usb === null) {
    return <div className={styles.telmiOSInactive}>
      <h2 className={styles.usbTitle}>{getLocale('telmi-not-detected')}</h2>
      <div className={styles.telmiOSInactiveArea}/>
    </div>
  } else {
    return <>
      <div className={styles.telmiOS}>
        <h2 className={styles.usbTitle}>
          {usb.telmiOS.label + ' v' + usb.telmiOS.version.major + '.' + usb.telmiOS.version.minor + '.' + usb.telmiOS.version.fix}
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
}

export default TelmiOSLayout
