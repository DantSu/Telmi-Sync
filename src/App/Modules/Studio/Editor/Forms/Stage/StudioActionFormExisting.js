import {useCallback} from 'react'
import {useLocale} from '../../../../../Components/Locale/LocaleHooks.js'
import {addStageOption} from '../StudioNodesHelpers.js'
import {useStudioStory, useStudioStoryUpdater} from '../../Providers/StudioStoryHooks.js'
import {useStudioForm} from '../../Providers/StudioStageHooks.js'

import styles from './StudioStageForm.module.scss'

function StudioActionFormExisting() {
  const
    {getLocale} = useLocale(),
    {nodes} = useStudioStory(),
    {form: stage} = useStudioForm(),
    {updateStory} = useStudioStoryUpdater(),
    stageNode = nodes.stages[stage],
    onDragEnter = useCallback((e) => e.target.classList.add(styles.actionLinkDragOver), []),
    onDragLeave = useCallback((e) => e.target.classList.remove(styles.actionLinkDragOver), []),
    onDragOver = useCallback(
      (e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'link'
      },
      []
    ),
    onDrop = useCallback(
      (e) => {
        e.target.classList.remove(styles.actionLinkDragOver)
        updateStory((s) => {
          return {
            ...s,
            nodes: addStageOption(s.nodes, stageNode, e.dataTransfer.getData('stageId'))
          }
        })
      },
      [stageNode, updateStory]
    )

  return <div className={[styles.actionNewItem, styles.actionLinkDropContainer].join(' ')}>
    <h4 className={styles.actionNewItemTitle2}>{getLocale('action-scene-existing')}</h4>
    <div className={styles.actionLinkDrop}
         onDragOver={onDragOver}
         onDrop={onDrop}
         onDragEnter={onDragEnter}
         onDragLeave={onDragLeave}
         title={getLocale('action-drop-scene')}/>
  </div>
}

export default StudioActionFormExisting