
import styles from './Loader.module.scss'

import loader from '../../Assets/Images/loader-2.svg'
function Loader() {
  return <div className={styles.container}>
    <img src={loader} alt="" className={styles.image}/>
    <p className={styles.text}>Veuillez patienter...</p>
  </div>
}

export default Loader
