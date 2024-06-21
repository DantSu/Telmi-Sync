import { useLocale } from '../../../Components/Locale/LocaleHooks.js'

import styles from '../Synchronize.module.scss'

function TelmiOSNotDetected () {
  const
    {getLocale} = useLocale()
    return <div className={styles.telmiOSInactive}>
      <h2 className={styles.telmiOSTitle}>
        <span className={styles.telmiOSTitleText}>
          {getLocale('telmios-not-detected')}
        </span>
      </h2>
      <div className={styles.telmiOSInactiveArea}/>
    </div>
}

export default TelmiOSNotDetected
