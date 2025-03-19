import {isImageDefined} from '../Helpers/FileHelpers.js'

import styles from './ModalPlayer.module.scss'

function PlayerInventoryItem({item, story}) {
  const
    image = item.newImage || isImageDefined(item.image, story.metadata.path)

  return <li className={styles.inventoryItemContainer}>
    {image && <img src={encodeURI(image.replaceAll('\\', '/'))} alt="" className={styles.inventoryItemImage}/>}
    {item.display === 0 && item.maxNumber > 1 && <span className={styles.inventoryItemCounter}>{item.count}</span>}
    {
      item.display === 1 && <div className={styles.inventoryItemBarBg}>
        <div className={styles.inventoryItemBar} style={{width: (item.count / item.maxNumber * 100) + '%'}}/>
      </div>
    }
  </li>
}

export default PlayerInventoryItem