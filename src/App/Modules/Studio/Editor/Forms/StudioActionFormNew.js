import {useRef} from 'react'
import {useLocale} from '../../../../Components/Locale/LocaleHooks.js'
import {useStudioStoryUpdater} from '../Providers/StudioStoryHooks.js'
import {addNote, addStage, addStageOption} from './StudioNodesHelpers.js'
import InputText from '../../../../Components/Form/Input/InputText.js'
import Form from '../../../../Components/Form/Form.js'
import ButtonIconTextPlus from '../../../../Components/Buttons/IconsTexts/ButtonIconTextPlus.js'

import styles from './StudioForm.module.scss'

function StudioActionFormNew({stageNode}) {
  const
    {getLocale} = useLocale(),
    {updateStory} = useStudioStoryUpdater(),
    nameRef = useRef(),
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
                     key={'action-new-stage-' + stageNode.ok?.action}
                     vertical={true}
                     ref={nameRef}/>
          <ButtonIconTextPlus text={getLocale('action-scene-new')}
                              className={styles.actionNewItemButton}
                              rounded={true}
                              onClick={() => validation([nameRef], onValidate)}/>
        </>
      }
    }</Form>
  </div>
}

export default StudioActionFormNew