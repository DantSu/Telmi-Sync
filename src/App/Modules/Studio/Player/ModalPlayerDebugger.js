
import ModalPlayerDebuggerItem from './ModalPlayerDebuggerItem.js'

import styles from './ModalPlayer.module.scss'

function ModalPlayerDebugger({items, setItems}) {
  return <div className={styles.inventoryDebugContainer}>
    <ul className={styles.inventoryDebugScroll}>{
      items.map((item) => <ModalPlayerDebuggerItem item={item} setItems={setItems}/>)
    }</ul>
  </div>
}

export default ModalPlayerDebugger