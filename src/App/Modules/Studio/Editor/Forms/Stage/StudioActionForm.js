import {useEffect, useRef} from 'react'
import {useLocale} from '../../../../../Components/Locale/LocaleHooks.js'
import {useStudioStory, useStudioStoryUpdater} from '../../Providers/StudioStoryHooks.js'
import {useStudioForm} from '../../Providers/StudioStageHooks.js'

import InputSelect from '../../../../../Components/Form/Input/InputSelect.js'
import StudioActionItemForm from './StudioActionItemForm.js'
import StudioActionFormExisting from './StudioActionFormExisting.js'
import StudioActionFormNew from './StudioActionFormNew.js'


import styles from './StudioStageForm.module.scss'

function StudioActionForm({stageNode}) {
  const
    {getLocale} = useLocale(),
    {story: {nodes, notes}, storyVersion} = useStudioStory(),
    {form: stage} = useStudioForm(),
    {updateStory} = useStudioStoryUpdater(),
    nextSceneRef = useRef(),
    actionNode = stageNode.ok === null ? [] : nodes.actions[stageNode.ok.action],
    actionIndex = stageNode.ok === null ? 0 : (stageNode.ok.index !== undefined ? stageNode.ok.index : stageNode.ok.indexItem),

    onActionIndexChange = (value) => {
      updateStory((s) => {
        if (stageNode.ok !== null) {
          if (typeof value === 'string') {
            if (stageNode.ok.index !== undefined) {
              delete stageNode.ok.index
            }
            stageNode.ok.indexItem = value
          } else {
            if (stageNode.ok.indexItem !== undefined) {
              delete stageNode.ok.indexItem
            }
            stageNode.ok.index = value
          }
          return {...s}
        }
        return s
      })
    }

  useEffect(() => {
    nextSceneRef.current.value = actionIndex
  }, [actionIndex])

  return <div className={styles.actionContainer}>
    <h2 className={styles.actionTitle}>{getLocale('what-next')}</h2>
    <InputSelect id={'action-default-index'}
                 key={'action-default-index-' + storyVersion + '-' + stage}
                 classNameInput={styles.selectNextScene}
                 ref={nextSceneRef}
                 label={getLocale('choose-next-scene')}
                 onChange={onActionIndexChange}
                 options={[
                   {value: -1, text: getLocale('randomly')},
                   ...actionNode.map((v, k) => ({value: k, text: k + ' : ' + notes[v.stage].title})),
                   ...(Array.isArray(nodes.inventory) ?
                       nodes.inventory.map((v) => ({value: v.id, text: 'Obj : ' + v.name})) : []
                   )
                 ]}
                 defaultValue={actionIndex}/>
    <ul className={styles.actionListContainer}>{
      actionNode.map((v, k) => <StudioActionItemForm stageNode={stageNode}
                                                     action={v}
                                                     actionPosition={k}
                                                     key={'action-item-' + k}/>)
    }</ul>
    <h3 className={styles.actionNewItemTitle}>{getLocale('action-continue-to')}</h3>
    <div className={styles.actionNewItemForm}>
      <StudioActionFormExisting stageNode={stageNode}/>
      <StudioActionFormNew stageNode={stageNode}/>
    </div>
  </div>
}

export default StudioActionForm