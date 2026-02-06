import {useEffect, useState} from 'react'
import {useElectronEmitter, useElectronListener} from '../../Components/Electron/Hooks/UseElectronEvent.js'
import {useLocale} from '../../Components/Locale/LocaleHooks.js'
import {useModal} from '../../Components/Modal/ModalHooks.js'
import TopBar from '../../Layout/TopBar/TopBar.js'
import AppContainer from '../../Layout/Container/AppContainer.js'
import ButtonExternalLink from '../../Components/Link/ButtonExternalLink.js'
import ButtonIconTextSmartphone from '../../Components/Buttons/IconsTexts/ButtonIconTextSmartphone.js'
import ButtonText from '../../Components/Buttons/Text/ButtonText.js'
import ModalAndroidAppProblem from './ModalAndroidAppProblem.js'

import imgQrCode from '../../Assets/Images/telmi-android-qrcode.png'
import styles from './AndroidApp.module.scss'


const {ipcRenderer} = window.require('electron')

function AndroidApp() {
  const
    {getLocale} = useLocale(),
    {addModal, rmModal} = useModal(),
    [serverState, setServerState] = useState('server-launching'),
    [serverIp, setServerIp] = useState(null)

  useElectronEmitter('server-launch', [])
  useElectronListener(
    'server-listen', (status, message, ips) => {
      if (status === 'server-error') {
        setServerIp(null)
      } else if (message === 'server-launched') {
        setServerIp(ips.split('|'))
      }
      setServerState(message)
    },
    []
  )
  useEffect(() => () => ipcRenderer.send('server-stop'), [])
  return <>
    <TopBar currentModule="AndroidApp"/>
    <AppContainer>
      <div className={styles.container}>
        <div className={[styles.cell, styles.cellTop].join(' ')}>
          <div className={styles.textContainer}>
            <h1 className={styles.titleMargin}>{getLocale('android-app-title')}</h1>

            <p className={styles.textMargin} dangerouslySetInnerHTML={{__html: getLocale('android-app-message')}}/>

            <ButtonExternalLink href="https://play.google.com/store/apps/details?id=com.dantsu.telmi">
              <ButtonIconTextSmartphone text={getLocale('android-app-playstore')} rounded={true}/>
            </ButtonExternalLink>
          </div>
          <div className={styles.qrcodeContainer}>
            <img src={imgQrCode} alt={getLocale('android-app-qrcode')} className={styles.qrcode}/>
          </div>
        </div>
        <div className={styles.cell}>
          <h2 className={styles.textMargin}>{getLocale('android-app-sync')}</h2>

          <p className={styles.textMargin} dangerouslySetInnerHTML={{__html: getLocale('android-app-sync-tuto')}}/>

          <div className={styles.serverStatus}>
            <p dangerouslySetInnerHTML={{__html: getLocale(serverState)}}/>
            {
              serverIp !== null &&
              !!serverIp.length &&
              <ul className={styles.serverIpContainer}>
                <li className={styles.ip}>
                  {
                    serverIp[0].split('.')
                      .map((n, k) => (<span className={styles.ipNumber} key={k}>{n}</span>))
                  }
                </li>
              </ul>
            }
            <ButtonText text={getLocale('problem') + ' ?'}
                        className={styles.problem}
                        onClick={() => {
                          addModal((key) => {
                            const modal = <ModalAndroidAppProblem key={key}
                                                                  serverIp={serverIp}
                                                                  onClose={() => rmModal(modal)}/>
                            return modal
                          })
                        }}/>
          </div>
        </div>
      </div>
    </AppContainer>
  </>
}

export default AndroidApp