import {useEffect, useRef} from 'react'
import {useLocale} from '../../../../../Components/Locale/LocaleHooks.js'
import {useStudioStory, useStudioStoryUpdater} from '../../Providers/StudioStoryHooks.js'
import {useStudioForm} from '../../Providers/StudioStageHooks.js'

import InputSwitch from '../../../../../Components/Form/Input/InputSwitch.js'
import StudioActionItemForm from './StudioActionItemForm.js'
import StudioActionFormExisting from './StudioActionFormExisting.js'
import StudioActionFormNew from './StudioActionFormNew.js'


import styles from './StudioStageForm.module.scss'

function StudioActionForm({stageNode}) {
  const
    {getLocale} = useLocale(),
    {nodes} = useStudioStory(),
    {form: stage} = useStudioForm(),
    {updateStory} = useStudioStoryUpdater(),
    randomRef = useRef(),
    actionNode = stageNode.ok === null ? [] : nodes.actions[stageNode.ok.action],
    actionIndex = stageNode.ok === null ? 0 : stageNode.ok.index,
    actionIndexRandom = actionIndex === -1,

    onActionIndexRandomChange = (e) => {
      updateStory((s) => {
        if (stageNode.ok !== null) {
          stageNode.ok.index = e.target.checked ? -1 : 0
          return {...s}
        }
        return s
      })
    }

  useEffect(() => {
    randomRef.current.checked = actionIndexRandom
  }, [actionIndexRandom])

  return <div className={styles.actionContainer}>
    <h2 className={styles.actionTitle}>{getLocale('what-next')}</h2>
    <InputSwitch id={'action-default-index'}
                 key={'action-default-index-' + stage}
                 ref={randomRef}
                 label={getLocale('choose-scene-randomly')}
                 onChange={onActionIndexRandomChange}
                 defaultValue={actionIndexRandom}/>
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