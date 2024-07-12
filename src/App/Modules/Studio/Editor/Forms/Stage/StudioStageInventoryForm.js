import {useRef} from 'react'
import {useLocale} from '../../../../../Components/Locale/LocaleHooks.js'
import {useStudioForm} from '../../Providers/StudioStageHooks.js'
import {useStudioStory, useStudioStoryUpdater} from '../../Providers/StudioStoryHooks.js'
import {getUpdateInventoryType} from '../StudioNodesHelpers.js'

import Form from '../../../../../Components/Form/Form.js'
import InputText from '../../../../../Components/Form/Input/InputText.js'
import InputSelect from '../../../../../Components/Form/Input/InputSelect.js'
import ButtonIconPlus from '../../../../../Components/Buttons/Icons/ButtonIconPlus.js'
import StudioStageInventoryUpdateForm from './StudioStageInventoryUpdateForm.js'

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
    typeRef = useRef(null),
    inventoryUpdate = Array.isArray(stageNode.items) ? stageNode.items : [],
    onValidate = (values) => updateStory((s) => {
      if (!Array.isArray(stageNode.items)) {
        stageNode.items = []
      }
      stageNode.items.push({item: values[1], number: values[0], type: parseInt(values[2])})
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
    <Form className={styles.conditionForm}>{
      (validation) => {
        return <>
          <h3 className={styles.conditionTitle}>{getLocale('operation-to-perform')}:</h3>
          <div className={styles.conditionInputSmall}>
            <InputSelect key={'inventory-update-type-' + inventoryUpdate.length}
                         options={getUpdateInventoryType().map((text, value) => ({value, text}))}
                         ref={typeRef}
                         vertical={true}/>
          </div>
          <div className={styles.conditionInputMedium}>
            <InputText key={'inventory-update-number-' + inventoryUpdate.length}
                       type="number"
                       min={1}
                       step={1}
                       defaultValue={1}
                       required={true}
                       vertical={true}
                       ref={numberRef}/>
          </div>
          <div className={styles.conditionInputWide}>
            <InputSelect key={'inventory-update-item-' + inventoryUpdate.length}
                         options={nodes.inventory.map((v) => ({value: v.id, text: v.name}))}
                         ref={itemRef}
                         vertical={true}/>
          </div>
          <ButtonIconPlus rounded={true}
                          title={getLocale('add')}
                          onClick={() => validation([numberRef, itemRef, typeRef], onValidate)}/>
        </>
      }
    }</Form>
  </div>
}

export default StudioStageInventoryForm