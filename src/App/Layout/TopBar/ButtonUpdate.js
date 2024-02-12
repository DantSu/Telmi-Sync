import { useElectronEmitter, useElectronListener } from '../../Components/Electron/Hooks/UseElectronEvent.js'
import { useState } from 'react'
import { useLocale } from '../../Components/Locale/LocaleHooks.js'

import styles from './TopBar.module.scss'
import ExternalLink from '../../Components/Link/ExternalLink.js'

function ButtonUpdate () {
  const
    [urlUpdate, setUrlUpdate] = useState(null),
    {getLocale} = useLocale()

  useElectronListener(
    'check-update-data',
    (url) => setUrlUpdate(url),
    [setUrlUpdate]
  )
  useElectronEmitter('check-update', [])

  return urlUpdate === null ? null : <ExternalLink href={urlUpdate}
                                                   className={styles.buttonUpdate}>{
    getLocale('update-available')
  }</ExternalLink>
}

export default ButtonUpdate
