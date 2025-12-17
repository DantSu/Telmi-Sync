import { useLocale } from '../Locale/LocaleHooks.js'
import loader from '../../Assets/Images/loader-2.svg'

import styles from './Loader.module.scss'

function Loader({inline}) {
  const {getLocale} = useLocale()
  return <div className={inline ? styles.containerInline : styles.container}>
    <img src={loader} alt="" className={styles.image}/>
    <p className={styles.text}>{getLocale('please-wait')}...</p>
  </div>
}

export default Loader
