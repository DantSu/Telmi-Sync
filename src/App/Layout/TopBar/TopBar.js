import { routeSynchronize } from '../../Modules/Synchronize/Routes.js'
import { routeStores } from '../../Modules/Stores/Routes.js'
import { useLocale } from '../../Components/Locale/LocaleHooks.js'

import ButtonIconXMark from '../../Components/Buttons/Icons/ButtonIconXMark.js'
import ButtonIconWindow from '../../Components/Buttons/Icons/ButtonIconWindow.js'
import ButtonIconTextArrowLeftRight from '../../Components/Buttons/IconsTexts/ButtonIconTextArrowLeftRight.js'
import ButtonIconTextStore from '../../Components/Buttons/IconsTexts/ButtonIconTextStore.js'
import TopButtonNavigation from './TopButtonNavigation.js'
import ButtonLangChooser from '../../Components/Locale/ButtonLangChooser.js'
import ButtonUpdate from './ButtonUpdate.js'

import LogoTelmi from '../../Assets/Images/logo-telmi.svg'

import styles from './TopBar.module.scss'

const {ipcRenderer} = window.require('electron')

function TopBar ({currentModule}) {
  const {getLocale} = useLocale()

  return <div className={styles.container}>
    <div className={styles.navigation}>
      <img src={LogoTelmi} className={styles.logo} alt="Telmi logo"/>
      <ul className={[styles.buttons, styles.buttonsNavigation].join(' ')}>
        <TopButtonNavigation buttonComponent={ButtonIconTextArrowLeftRight}
                             text={getLocale('synchronize')}
                             route={routeSynchronize}
                             currentModule={currentModule}/>
        <TopButtonNavigation buttonComponent={ButtonIconTextStore}
                             text={getLocale('stores')}
                             route={routeStores}
                             currentModule={currentModule}/>
      </ul>
    </div>
    <ul className={styles.buttons}>
      <li><ButtonUpdate/></li>
      <li><ButtonLangChooser/></li>
      <li><ButtonIconWindow onClick={() => ipcRenderer.send('change-size')}/></li>
      <li><ButtonIconXMark onClick={() => ipcRenderer.send('close')}/></li>
    </ul>
  </div>
}

export default TopBar
