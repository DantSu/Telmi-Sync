import {useLocale} from '../../../../../Components/Locale/LocaleHooks.js'
import {useStudioStory} from '../../Providers/StudioStoryHooks.js'

import StudioInventoryItemForm from './StudioInventoryItemForm.js'
import StudioInventoryItem from './StudioInventoryItem.js'

import styles from './StudioInventoryForm.module.scss'

function StudioInventoryForm() {
  const
    {getLocale} = useLocale(),
    {nodes} = useStudioStory()

  return <>
    <ul>{
      Array.isArray(nodes.inventory) &&
      nodes.inventory.map((v, k) => <StudioInventoryItem key={'inventory-item-' + v.id} itemKey={k}/>)
    }</ul>
    <h2 className={styles.title}>{getLocale('inventory-add-new')}</h2>
    <StudioInventoryItemForm itemKey={-1}/>
  </>
}

export default StudioInventoryForm