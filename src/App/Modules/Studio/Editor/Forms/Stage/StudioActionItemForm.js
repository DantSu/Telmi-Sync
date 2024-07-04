import {useCallback} from 'react'
import {useLocale} from '../../../../../Components/Locale/LocaleHooks.js'
import {useStudioStory, useStudioStoryUpdater} from '../../Providers/StudioStoryHooks.js'
import {useStudioForm} from '../../Providers/StudioStageHooks.js'
import {nodesMoveObject} from '../StudioNodesHelpers.js'
import {useDragAndDropMove} from '../../../../../Components/Form/DragAndDrop/DragAndDropMoveHook.js'
import ButtonIconSquareCheck from '../../../../../Components/Buttons/Icons/ButtonIconSquareCheck.js'
import ButtonIconTrash from '../../../../../Components/Buttons/Icons/ButtonIconTrash.js'


import styles from './StudioStageForm.module.scss'
import StudioActionConditions from './StudioActionConditions.js'

function StudioActionItemForm({action, actionPosition}) {
  const
    {getLocale} = useLocale(),
    {notes, nodes} = useStudioStory(),
    {form: stage} = useStudioForm(),
    {updateStory} = useStudioStoryUpdater(),
    parentStage = nodes.stages[stage],
    note = notes[action.stage],

    onDropCallback = useCallback(
      (dragItemKey) => {
        updateStory((s) => {
          const nodes = nodesMoveObject(s.nodes, s.nodes.actions[parentStage.ok.action], dragItemKey, action)
          return nodes !== s.nodes ? {...s, nodes} : s
        })
      },
      [action, parentStage.ok.action, updateStory]
    ),
    {
      onDragStart,
      onDragOver,
      onDragEnter,
      onDragLeave,
      onDrop,
      onPreventChildDraggable
    } = useDragAndDropMove(actionPosition, 'ActionItem', styles.actionItemDragOver, onDropCallback),

    onDefault = useCallback(
      () => {
        parentStage.ok.index = actionPosition
        updateStory((s) => ({...s}))
      },
      [actionPosition, parentStage, updateStory]
    ),
    onDelete = useCallback(
      () => updateStory((s) => {
        s.nodes.actions[parentStage.ok.action].splice(actionPosition, 1)
        return {...s, nodes: {...s.nodes}}
      }),
      [actionPosition, parentStage.ok.action, updateStory]
    )

  return <li draggable={true}
             onDragStart={onDragStart}
             onDragOver={onDragOver}
             onDragEnter={onDragEnter}
             onDragLeave={onDragLeave}
             onDrop={onDrop}
             className={[
               styles.actionItem,
               parentStage.ok.index === actionPosition ? styles.actionItemDefaultChoice : ''
             ].join(' ')}>
    <div className={styles.actionItemTitle}>
      <span className={styles.actionItemText}>{note.title}</span>
      <ButtonIconSquareCheck className={styles.actionItemButton}
                             title={getLocale('action-default')}
                             onDragStart={onPreventChildDraggable}
                             onDragEnter={onPreventChildDraggable}
                             onDragLeave={onPreventChildDraggable}
                             onDrop={onPreventChildDraggable}
                             onClick={onDefault}/>
      <ButtonIconTrash className={styles.actionItemButton}
                       title={getLocale('action-delete')}
                       onDragStart={onPreventChildDraggable}
                       onDragEnter={onPreventChildDraggable}
                       onDragLeave={onPreventChildDraggable}
                       onDrop={onPreventChildDraggable}
                       onClick={onDelete}/>

    </div>
    {Array.isArray(nodes.inventory) && <StudioActionConditions action={action}
                                                               actionPosition={actionPosition}
                                                               onDragStart={onPreventChildDraggable}
                                                               onDragEnter={onPreventChildDraggable}
                                                               onDragLeave={onPreventChildDraggable}
                                                               onDrop={onPreventChildDraggable}/>}
  </li>
}

export default StudioActionItemForm