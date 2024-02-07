import { useLocale } from './LocaleHooks.js'
import ButtonText from '../Buttons/Text/ButtonText.js'

import styles from './Locale.module.scss'
import { useCallback, useState } from 'react'

const ButtonLang = ({lang}) => {
  const {setLang} = useLocale()

  return <li>
    <ButtonText className={styles.button}
                text={lang.toUpperCase()}
                onClick={() => setLang(lang)}/>
  </li>
}

function ButtonLangChooser () {
  const
    {lang} = useLocale(),
    [openBubble, setOpenBubble] = useState(false),
    onOpenBubble = useCallback(() => setOpenBubble((openBubble) => !openBubble), [setOpenBubble])

  return <div className={styles.container}>
    <ButtonText className={styles.button} text={lang.toUpperCase()} onClick={onOpenBubble}/>
    {
      openBubble &&
      <ul className={styles.bubble} onClick={() => setOpenBubble(false)}>
        <ButtonLang key="lang-fr" lang="fr"/>
        <ButtonLang key="lang-en" lang="en"/>
      </ul>}
  </div>
}

export default ButtonLangChooser
