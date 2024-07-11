import {isImageDefined} from '../Helpers/FileHelpers.js'

import styles from './ModalPlayer.module.scss'

function PlayerInventoryItem({item, story}) {
  return <li className={styles.inventoryItemContainer}>
    <img src={item.newImage || isImageDefined(item.image, story.metadata.path)}
         alt=""
         className={styles.inventoryItemImage}/>
    {item.display === 0 && item.count > 1 && <span className={styles.inventoryItemCounter}>{item.count}</span>}
    {
      item.display === 1 && <div className={styles.inventoryItemBarBg}>
      <div className={styles.inventoryItemBar} style={{width: (item.count / item.maxNumber * 100) + '%'}}/>
    </div>
    }
  </li>
}

export default PlayerInventoryItem