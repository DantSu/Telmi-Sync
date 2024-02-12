import { useElectronEmitter, useElectronListener } from '../../Components/Electron/Hooks/UseElectronEvent.js'
import { useState } from 'react'
import { useLocale } from '../../Components/Locale/LocaleHooks.js'
import ButtonExternalLink from '../../Components/Link/ButtonExternalLink.js'
import ButtonIconTextCloud from '../../Components/Buttons/IconsTexts/ButtonIconTextCloud.js'

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

  return urlUpdate === null ? null : <ButtonExternalLink href={urlUpdate}>
    <ButtonIconTextCloud text={getLocale('update-available')} rounded={true}/>
  </ButtonExternalLink>
}

export default ButtonUpdate
