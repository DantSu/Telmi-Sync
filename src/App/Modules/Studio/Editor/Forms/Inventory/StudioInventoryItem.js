import {useCallback, useState} from 'react'
import {useModal} from '../../../../../Components/Modal/ModalHooks.js'
import {useStudioStory, useStudioStoryUpdater} from '../../Providers/StudioStoryHooks.js'
import {useDragAndDropMove} from '../../../../../Components/Form/DragAndDrop/DragAndDropMoveHook.js'
import {nodesMoveObject} from '../StudioNodesHelpers.js'

import ButtonIconPen from '../../../../../Components/Buttons/Icons/ButtonIconPen.js'
import ButtonIconTrash from '../../../../../Components/Buttons/Icons/ButtonIconTrash.js'
import StudioInventoryItemForm from './StudioInventoryItemForm.js'
import ModalStudioInventoryDeleteError from './ModalStudioInventoryDeleteError.js'

import styles from './StudioInventoryForm.module.scss'

function StudioInventoryItem({itemKey}) {
  const
    [displayForm, setDisplayForm] = useState(false),
    {story} = useStudioStory(),
    {addModal, rmModal} = useModal(),
    nodes = story.nodes,
    {updateStory} = useStudioStoryUpdater(),
    item = nodes.inventory[itemKey],

    onEdit = useCallback(() => setDisplayForm(v => !v), []),

    onDropCallback = useCallback(
      (dragItemKeyStr) => {
        const dragItemKey = parseInt(dragItemKeyStr, 10)
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
        const
          item = story.nodes.inventory[itemKey],
          usedItemInStages = [...Object.keys(story.nodes.stages).filter(
            (stageKey) => {
              const stage = story.nodes.stages[stageKey]
              return (
                (stage.ok !== null && stage.ok.indexItem === item.id) ||
                (Array.isArray(stage.items) && stage.items.find((v) => v.item === item.id || v.assignItem === item.id) !== undefined)
              )
            }
          ),
            ...Object.keys(story.nodes.actions).reduce(
              (acc, actionKey) => {
                if (
                  story.nodes.actions[actionKey].find(
                    (v) => Array.isArray(v.conditions) &&
                      v.conditions.find((v) => v.item === item.id || v.compareItem === item.id) !== undefined
                  ) !== undefined
                ) {
                  return [
                    ...acc,
                    ...Object.keys(story.nodes.stages).filter((stageKey) => {
                      const stage = story.nodes.stages[stageKey]
                      return (
                        (stage.ok !== null && stage.ok.action === actionKey) ||
                        (stage.home !== null && stage.home.action === actionKey)
                      )
                    })
                  ]
                }
                return acc
              },
              []
            )
          ].map((v) => story.notes[v].title)

        if (usedItemInStages.length) {
          addModal((key) => {
            const modal = <ModalStudioInventoryDeleteError key={key}
                                                           stages={usedItemInStages}
                                                           onClose={() => rmModal(modal)}/>
            return modal
          })
          return
        }

        story.nodes.inventory.splice(itemKey, 1)

        if (!story.nodes.inventory.length) {
          delete story.nodes.inventory
        }

        updateStory({...story, nodes: {...story.nodes}})
      },
      [addModal, itemKey, rmModal, story, updateStory]
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
                     draggable={true}
                     onDragStart={onPreventChildDraggable}
                     onDragEnter={onPreventChildDraggable}
                     onDragLeave={onPreventChildDraggable}
                     onDrop={onPreventChildDraggable}
                     className={styles.itemButton}/>
      <ButtonIconTrash onClick={onDelete}
                       draggable={true}
                       onDragStart={onPreventChildDraggable}
                       onDragEnter={onPreventChildDraggable}
                       onDragLeave={onPreventChildDraggable}
                       onDrop={onPreventChildDraggable}
                       className={styles.itemButton}/>
    </div>
    {
      displayForm &&
      <div className={styles.itemForm}
           draggable={true}
           onDragStart={onPreventChildDraggable}
           onDragEnter={onPreventChildDraggable}
           onDragLeave={onPreventChildDraggable}
           onDrop={onPreventChildDraggable}>
        <StudioInventoryItemForm itemKey={itemKey} onValidate={onEdit}/>
      </div>
    }
  </li>
}

export default StudioInventoryItem