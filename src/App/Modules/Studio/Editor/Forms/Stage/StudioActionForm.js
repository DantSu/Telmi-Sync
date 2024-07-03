import {useLocale} from '../../../../../Components/Locale/LocaleHooks.js'
import {useStudioStory} from '../../Providers/StudioStoryHooks.js'
import {useStudioForm} from '../../Providers/StudioStageHooks.js'
import StudioActionItemForm from './StudioActionItemForm.js'
import StudioActionFormExisting from './StudioActionFormExisting.js'
import StudioActionFormNew from './StudioActionFormNew.js'


import styles from './StudioStageForm.module.scss'

function StudioActionForm() {
  const
    {getLocale} = useLocale(),
    {form: stage} = useStudioForm(),
    {nodes} = useStudioStory(),
    stageNode = nodes.stages[stage],
    actionNode = stageNode.ok === null ? [] : nodes.actions[stageNode.ok.action]

  return <div className={styles.actionContainer}>
    <h2 className={styles.actionTitle}>{getLocale('what-next')}</h2>
    <ul className={styles.actionListContainer}>{
      actionNode.map((v, k) => <StudioActionItemForm action={v}
                                                     actionPosition={k}
                                                     key={'action-item-' + k}/>)
    }</ul>
    <h3 className={styles.actionNewItemTitle}>{getLocale('action-continue-to')}</h3>
    <div className={styles.actionNewItemForm}>
      <StudioActionFormExisting/>
      <StudioActionFormNew/>
    </div>
  </div>
}

export default StudioActionForm