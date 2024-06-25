import {useCallback} from 'react'
import {useLocale} from '../../../../Components/Locale/LocaleHooks.js'
import {useStudioStory, useStudioStoryUpdater} from '../Providers/StudioStoryHooks.js'
import ButtonIconSquareCheck from '../../../../Components/Buttons/Icons/ButtonIconSquareCheck.js'
import ButtonIconTrash from '../../../../Components/Buttons/Icons/ButtonIconTrash.js'


import styles from './StudioForm.module.scss'

function StudioActionItemForm({action, actionPosition, parentStage}) {
  const
    {getLocale} = useLocale(),
    {notes} = useStudioStory(),
    {updateStory} = useStudioStoryUpdater(),
    note = notes[action.stage],
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

  return <li
    className={[styles.actionItem, parentStage.ok.index === actionPosition ? styles.actionItemDefaultChoice : ''].join(' ')}>
    <span className={styles.actionItemText}>{note.title}</span>
    <ButtonIconSquareCheck className={styles.actionItemButton}
                           title={getLocale('action-default')}
                           onClick={onDefault}/>
    <ButtonIconTrash className={styles.actionItemButton}
                     title={getLocale('action-delete')}
                     onClick={onDelete}/>
  </li>
}

export default StudioActionItemForm