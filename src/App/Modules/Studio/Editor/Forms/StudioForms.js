import {useStudioStage} from '../Providers/StudioStageHooks.js'
import styles from '../StudioStoryEditor.module.scss'
import StudioStartStageForm from './StudioStartStageForm.js'
import StudioStageForm from './StudioStageForm.js'


function StudioForms() {
  const {stage} = useStudioStage()

  if (stage === null) {
    return null
  }

  return <div className={styles.paramsContainer}>
    <div className={styles.paramsForms}>
      {stage === 'startStage' ? <StudioStartStageForm/> : <StudioStageForm/>}
    </div>
  </div>
}

export default StudioForms