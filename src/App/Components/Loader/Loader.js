
import styles from './Loader.module.scss'

import loader from '../../Assets/Images/loader-2.svg'
import { useLocale } from '../Locale/LocaleHooks.js'
function Loader() {
  const {getLocale} = useLocale()
  return <div className={styles.container}>
    <img src={loader} alt="" className={styles.image}/>
    <p className={styles.text}>{getLocale('please-wait')}...</p>
  </div>
}

export default Loader
