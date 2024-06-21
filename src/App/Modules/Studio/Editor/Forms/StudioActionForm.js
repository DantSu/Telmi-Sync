import {useLocale} from '../../../../Components/Locale/LocaleHooks.js'
import {useStudioStory, useStudioStoryUpdater} from '../Providers/StudioStoryHooks.js'

import styles from './StudioForm.module.scss'

function StudioActionForm({stage}) {
  const
    {getLocale} = useLocale(),
    {metadata, nodes, notes} = useStudioStory(),
    {updateStory} = useStudioStoryUpdater(),
    note = notes[stage],
    stageNode = nodes.stages[stage]


  return <div className={styles.actionContainer}>
    <h2 className={styles.actionTitle}>{getLocale('what-next')}</h2>
    <ul>
      <li></li>
    </ul>
  </div>
}

export default StudioActionForm