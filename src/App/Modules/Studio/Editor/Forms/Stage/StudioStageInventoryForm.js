import {useRef, useState} from 'react'
import {useLocale} from '../../../../../Components/Locale/LocaleHooks.js'
import {useStudioForm} from '../../Providers/StudioStageHooks.js'
import {useStudioStory, useStudioStoryUpdater} from '../../Providers/StudioStoryHooks.js'
import {getAssigmentOperators} from '../StudioNodesHelpers.js'

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
    {story: {nodes}, storyVersion} = useStudioStory(),
    {updateStory} = useStudioStoryUpdater(),
    [typeValue, setTypeValue] = useState(0),
    stageNode = nodes.stages[stage],
    itemRef = useRef(null),
    typeRef = useRef(null),
    typeValueRef = useRef(null),
    numberRef = useRef(null),
    assignItemRef = useRef(null),

    inventoryUpdate = Array.isArray(stageNode.items) ? stageNode.items : [],
    onValidate = (values) => updateStory((s) => {
      if (!Array.isArray(stageNode.items)) {
        stageNode.items = []
      }
      setTypeValue(0)
      stageNode.items.push(
        values[2] === 0 ?
          {item: values[0], number: values[3], type: values[1]} :
          {item: values[0], assignItem: values[4], type: values[1]}
      )
      return {
        ...s,
        nodes: {...s.nodes}
      }
    }),

    inventoryOptions = nodes.inventory.map((v) => ({value: v.id, text: v.name}))

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
          <h3 className={styles.conditionTitle}>{getLocale('add-operation')}:</h3>
          <div className={styles.conditionInputWide}>
            <InputSelect key={'inventory-update-item-' + storyVersion + '-' + stage + '-' + inventoryUpdate.length}
                         options={inventoryOptions}
                         ref={itemRef}
                         vertical={true}/>
          </div>
          <div className={styles.conditionInputSmall}>
            <InputSelect key={'inventory-update-type-' + storyVersion + '-' + stage + '-' + inventoryUpdate.length}
                         options={getAssigmentOperators().map((text, value) => ({value, text}))}
                         ref={typeRef}
                         vertical={true}/>
          </div>
          <div className={styles.conditionInputSmall}>
            <InputSelect key={'inventory-update-typevalue-' + storyVersion + '-' + stage + '-' + inventoryUpdate.length}
                         options={[{value: 0, text: 'Nbr.'}, {value: 1, text: 'Obj.'}]}
                         vertical={true}
                         onChange={(value) => setTypeValue(value)}
                         ref={typeValueRef}/>
          </div>
          {
            typeValue === 0 ?
              <div className={styles.conditionInputWide}>
                <InputText key={'inventory-update-number-' + storyVersion + '-' + stage + '-' + inventoryUpdate.length}
                           type="number"
                           min={0}
                           step={1}
                           defaultValue={0}
                           required={true}
                           vertical={true}
                           ref={numberRef}/>
              </div> :
              <div className={styles.conditionInputWide}>
                <InputSelect key={'inventory-update-assignitem-' + storyVersion + '-' + stage + '-' + inventoryUpdate.length}
                             options={inventoryOptions}
                             ref={assignItemRef}
                             vertical={true}/>
              </div>
          }
          <div className={styles.conditionInputTiny}>
            <ButtonIconPlus rounded={true}
                            title={getLocale('add-operation-to-perform')}
                            className={styles.buttonValidate}
                            onClick={() => validation([itemRef, typeRef, typeValueRef, numberRef, assignItemRef], onValidate)}/>
          </div>
        </>
      }
    }</Form>
  </div>
}

export default StudioStageInventoryForm