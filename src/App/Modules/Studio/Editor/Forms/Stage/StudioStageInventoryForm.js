import {useRef} from 'react'
import {useLocale} from '../../../../../Components/Locale/LocaleHooks.js'
import {useStudioForm} from '../../Providers/StudioStageHooks.js'
import {useStudioStory, useStudioStoryUpdater} from '../../Providers/StudioStoryHooks.js'
import StudioStageInventoryUpdateForm from './StudioStageInventoryUpdateForm.js'
import Form from '../../../../../Components/Form/Form.js'
import InputText from '../../../../../Components/Form/Input/InputText.js'
import ButtonIconTextPlus from '../../../../../Components/Buttons/IconsTexts/ButtonIconTextPlus.js'
import InputSelect from '../../../../../Components/Form/Input/InputSelect.js'

import styles from './StudioStageForm.module.scss'

function StudioStageInventoryForm() {
  const
    {getLocale} = useLocale(),
    {form: stage} = useStudioForm(),
    {nodes} = useStudioStory(),
    {updateStory} = useStudioStoryUpdater(),
    stageNode = nodes.stages[stage],
    numberRef = useRef(null),
    itemRef = useRef(null),
    inventoryUpdate = Array.isArray(stageNode.inventoryUpdate) ? stageNode.inventoryUpdate : [],
    onValidate = (values) => updateStory((s) => {
      if (!Array.isArray(stageNode.inventoryUpdate)) {
        stageNode.inventoryUpdate = []
      }
      stageNode.inventoryUpdate.push({itemId: values[1], number: values[0]})
      return {
        ...s,
        nodes: {...s.nodes}
      }
    })

  return <div className={styles.actionContainer}>
    <h2 className={styles.actionTitle}>{getLocale('inventory-update')}</h2>
    <ul className={styles.inventoryUpdatesContainer}>{
      inventoryUpdate.map((v, k) => <StudioStageInventoryUpdateForm rule={v}
                                                                    rulePosition={k}
                                                                    parentStage={stageNode}
                                                                    key={'inventory-rule-' + k}/>)
    }</ul>
    <h3 className={styles.actionNewItemTitle}>{getLocale('inventory-update-add')}</h3>
    <Form>{
      (validation) => {
        return <>
          <InputText id={'inventory-update-number'}
                     key={'inventory-update-number-' + stage + '-' + inventoryUpdate.length}
                     type="number"
                     label={getLocale('add-remove')}
                     step={1}
                     defaultValue={1}
                     required={true}
                     ref={numberRef}/>
          <InputSelect id={'inventory-update-item'}
                       key={'inventory-update-item-' + stage + '-' + inventoryUpdate.length}
                       label={getLocale('inventory-of-item')}
                       options={nodes.inventory.map((v) => ({value: v.id, text: v.name}))}
                       ref={itemRef}/>
          <ButtonIconTextPlus text={getLocale('add')}
                              className={styles.actionNewItemButton}
                              rounded={true}
                              onClick={() => validation([numberRef, itemRef], onValidate)}/>
        </>
      }
    }</Form>
  </div>
}

export default StudioStageInventoryForm