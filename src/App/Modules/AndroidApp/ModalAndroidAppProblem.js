import {useLocale} from '../../Components/Locale/LocaleHooks.js'
import ModalLayoutPadded from '../../Components/Modal/ModalLayoutPadded.js'
import ModalTitle from '../../Components/Modal/ModalTitle.js'
import ModalContent from '../../Components/Modal/ModalContent.js'

import styles from './AndroidApp.module.scss'

function ModalAndroidAppProblem({onClose, serverIp}) {
  const {getLocale} = useLocale()
  return <ModalLayoutPadded isClosable={true}
                            className={styles.modalProblem}
                            onClose={onClose}>
    <ModalTitle>{getLocale('problem')} ?</ModalTitle>
    <ModalContent>
      <p dangerouslySetInnerHTML={{__html: getLocale('android-app-problem')}}/>
      {
        serverIp !== null &&
        !!serverIp.length &&
        <ul className={styles.serverIpContainer}>{
          serverIp.map((ip, k) => (
            <li className={styles.ip} key={'android-app-code-' + k}>{getLocale('code-number', k + 1)} : {
              ip.split('.').map((n, l) => (<span className={styles.ipNumber} key={'android-app-code-' + k + '-' + l}>{n}</span>))
            }</li>
          ))
        }</ul>
      }
    </ModalContent>
  </ModalLayoutPadded>
}


export default ModalAndroidAppProblem