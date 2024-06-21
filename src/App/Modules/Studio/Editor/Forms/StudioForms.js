import {useStudioStage} from '../Providers/StudioStageHooks.js'

import StudioStartStageForm from './StudioStartStageForm.js'
import StudioStageForm from './StudioStageForm.js'

import styles from './StudioForm.module.scss'

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