
import PlayerInventoryItem from './PlayerInventoryItem.js'

import styles from './ModalPlayer.module.scss'

function PlayerInventory({items, story}) {
  return <div className={styles.inventory}>
    <ul className={styles.inventoryList}>{
      items.map((item) => <PlayerInventoryItem key={'inventory-item-' + item.id} item={item} story={story} />)
    }</ul>
  </div>
}

export default PlayerInventory