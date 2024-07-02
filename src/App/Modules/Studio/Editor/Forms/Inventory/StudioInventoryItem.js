import {useCallback, useState} from 'react'
import {useStudioStory, useStudioStoryUpdater} from '../../Providers/StudioStoryHooks.js'
import ButtonIconPen from '../../../../../Components/Buttons/Icons/ButtonIconPen.js'
import ButtonIconTrash from '../../../../../Components/Buttons/Icons/ButtonIconTrash.js'
import StudioInventoryItemForm from './StudioInventoryItemForm.js'

import styles from './StudioInventoryForm.module.scss'
import {useDragAndDropMove} from '../../../../../Components/Form/DragAndDrop/DragAndDropMoveHook.js'
import {nodesMoveObject} from '../StudioNodesHelpers.js'

function StudioInventoryItem({itemKey}) {
  const
    [displayForm, setDisplayForm] = useState(false),
    {nodes} = useStudioStory(),
    {updateStory} = useStudioStoryUpdater(),
    item = nodes.inventory[itemKey],

    onEdit = useCallback(() => setDisplayForm(v => !v), []),

    onDropCallback = useCallback(
      (dragItemKey) => {
        updateStory((s) => {
          const nodes = nodesMoveObject(s.nodes, s.nodes.inventory, dragItemKey, item)
          return nodes !== s.nodes ? {...s, nodes} : s
        })
      },
      [item, updateStory]
    ),
    {
      onDragStart,
      onDragOver,
      onDragEnter,
      onDragLeave,
      onDrop,
      onPreventChildDraggable
    } = useDragAndDropMove(itemKey, 'InventoryItem', styles.itemDragOver, onDropCallback),

    onDelete = useCallback(
      () => {
        updateStory((s) => {
          s.nodes.inventory.splice(itemKey, 1)
          return {...s, nodes: {...s.nodes}}
        })
      },
      [itemKey, updateStory]
    )

  return <li className={styles.itemContainer}
             draggable={true}
             onDragStart={onDragStart}
             onDragOver={onDragOver}
             onDragEnter={onDragEnter}
             onDragLeave={onDragLeave}
             onDrop={onDrop}>
    <div className={styles.itemLabel}>
      <span className={styles.itemTitle}>{item.name}</span>
      <ButtonIconPen onClick={onEdit}
                     onDragStart={onPreventChildDraggable}
                     onDragEnter={onPreventChildDraggable}
                     onDragLeave={onPreventChildDraggable}
                     onDrop={onPreventChildDraggable}
                     className={styles.itemButton}/>
      <ButtonIconTrash onClick={onDelete}
                       onDragStart={onPreventChildDraggable}
                       onDragEnter={onPreventChildDraggable}
                       onDragLeave={onPreventChildDraggable}
                       onDrop={onPreventChildDraggable}
                       className={styles.itemButton}/>
    </div>
    {
      displayForm &&
      <div className={styles.itemForm}>
        <StudioInventoryItemForm itemKey={itemKey} onValidate={onEdit}/>
      </div>}
  </li>
}

export default StudioInventoryItem