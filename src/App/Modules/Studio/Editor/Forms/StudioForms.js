import {useStudioForm} from '../Providers/StudioStageHooks.js'

import StudioStartStageForm from './Stage/StudioStartStageForm.js'
import StudioStageForm from './Stage/StudioStageForm.js'
import StudioInventoryForm from './Inventory/StudioInventoryForm.js'
import StudioAudioList from './Audio/StudioAudioList.js'

import styles from './StudioForm.module.scss'

const
  StudioFormSelector = ({form}) => {
    if(form === 'form-inventory') {
      return <StudioInventoryForm/>
    }
    if(form === 'form-audio') {
      return <StudioAudioList/>
    }
    if(form === 'startStage') {
      return <StudioStartStageForm/>
    }
    return <StudioStageForm key={form}/>
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