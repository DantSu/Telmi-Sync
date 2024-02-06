
import styles from './Tabs.module.scss'

function Tab({button, selected, onClick}) {
  const ButtonComponent = button
  return <li className={selected ? styles.tabSelected : styles.tab}>
    <ButtonComponent onClick={onClick} className={selected ? styles.buttonSelected :  styles.button} />
  </li>
}


export default Tab
