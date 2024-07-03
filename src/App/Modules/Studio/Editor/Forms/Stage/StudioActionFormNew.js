import {useRef} from 'react'
import {useLocale} from '../../../../../Components/Locale/LocaleHooks.js'
import {useStudioStory, useStudioStoryUpdater} from '../../Providers/StudioStoryHooks.js'
import {useStudioForm} from '../../Providers/StudioStageHooks.js'
import {addNote, addStage, addStageOption} from '../StudioNodesHelpers.js'
import InputText from '../../../../../Components/Form/Input/InputText.js'
import Form from '../../../../../Components/Form/Form.js'
import ButtonIconTextPlus from '../../../../../Components/Buttons/IconsTexts/ButtonIconTextPlus.js'

import styles from './StudioStageForm.module.scss'

function StudioActionFormNew() {
  const
    {getLocale} = useLocale(),
    {nodes} = useStudioStory(),
    {form: stage} = useStudioForm(),
    {updateStory} = useStudioStoryUpdater(),
    stageNode = nodes.stages[stage],
    countActions = stageNode.ok !== null && nodes.actions[stageNode.ok.action] !== undefined ? nodes.actions[stageNode.ok.action].length : 0,

    nameRef = useRef(null),
    onValidate = (values) => updateStory((s) => {
      const stageId = addStage(s.nodes)
      return {
        ...s,
        notes: addNote(s.notes, stageId, values[0]),
        nodes: addStageOption(s.nodes, stageNode, stageId)
      }
    })

  return <div className={styles.actionNewItem}>
    <h4 className={styles.actionNewItemTitle2}>{getLocale('action-scene-new')}</h4>
    <Form>{
      (validation) => {
        return <>
          <InputText id={'action-new-stage'}
                     key={'action-new-stage-' + stage + '-' + countActions}
                     vertical={true}
                     ref={nameRef}/>
          <ButtonIconTextPlus text={getLocale('add')}
                              className={styles.actionNewItemButton}
                              rounded={true}
                              onClick={() => validation([nameRef], onValidate)}/>
        </>
      }
    }</Form>
  </div>
}

export default StudioActionFormNew