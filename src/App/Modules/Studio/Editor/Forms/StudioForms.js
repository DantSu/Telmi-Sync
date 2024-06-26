import {useStudioForm} from '../Providers/StudioStageHooks.js'

import StudioStartStageForm from './StudioStartStageForm.js'
import StudioStageForm from './StudioStageForm.js'

import styles from './StudioForm.module.scss'

const
  StudioFormSelector = ({form}) => {
    if(form === 'form-inventory') {
      return null
    }
    if(form === 'startStage') {
      return <StudioStartStageForm/>
    }
    return <StudioStageForm/>
  }

function StudioForms() {
  const {form} = useStudioForm()

  if (form === null) {
    return null
  }

  return <div className={styles.paramsContainer}>
    <div className={styles.paramsForms}>
      <StudioFormSelector form={form} />
    </div>
  </div>
}

export default StudioForms