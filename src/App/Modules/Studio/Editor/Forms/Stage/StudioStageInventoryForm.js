import {useRef, useState} from 'react'
import {useLocale} from '../../../../../Components/Locale/LocaleHooks.js'
import {useStudioForm} from '../../Providers/StudioStageHooks.js'
import {useStudioStory, useStudioStoryUpdater} from '../../Providers/StudioStoryHooks.js'
import {getAssigmentOperators} from '../StudioNodesHelpers.js'

import Form from '../../../../../Components/Form/Form.js'
import InputText from '../../../../../Components/Form/Input/InputText.js'
import InputSelect from '../../../../../Components/Form/Input/InputSelect.js'
import InputSwitch from '../../../../../Components/Form/Input/InputSwitch.js'
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

    onInventoryResetChange = (e) => {
      const value = e.target.checked
      updateStory((s) => {
        const nodeStage = s.nodes.stages[stage]
        if (value && !nodeStage.inventoryReset) {
          return {
            ...s,
            nodes: {
              ...s.nodes,
              stages: {
                ...s.nodes.stages,
                [stage]: {...nodeStage, inventoryReset: true}
              }
            }
          }
        }
        if (!value && nodeStage.inventoryReset) {
          delete nodeStage.inventoryReset
          return {
            ...s,
            nodes: {
              ...s.nodes,
              stages: {
                ...s.nodes.stages,
                [stage]: {...nodeStage}
              }
            }
          }
        }
        return s
      })
    },

    itemRef = useRef(null),
    typeRef = useRef(null),
    typeValueRef = useRef(null),
    numberRef = useRef(null),
    assignItemRef = useRef(null),

    inventoryUpdate = Array.isArray(stageNode.items) ? stageNode.items : [],
    onValidate = (values) => {
      updateStory((s) => {
        const stageNode = s.nodes.stages[stage]
        if (!Array.isArray(stageNode.items)) {
          stageNode.items = []
        }
        stageNode.items.push(
          values[2] === 0 ?
            {item: values[0], type: values[1], number: values[3]} : (
              values[4] === 'playingTime' ?
                {item: values[0], type: values[1], playingTime: true} :
                {item: values[0], type: values[1], assignItem: values[4]}
            )
        )
        return {
          ...s,
          nodes: {...s.nodes}
        }
      })
      setTypeValue(0)
    },

    inventoryOptions = nodes.inventory.map((v) => ({value: v.id, text: v.name}))

  return <div className={styles.actionContainer}>
    <h2 className={styles.actionTitle}>{getLocale('inventory-update')}</h2>

    <InputSwitch label={getLocale('inventory-reset')}
                 key={'inventory-reset-' + storyVersion + '-' + stage}
                 defaultValue={stageNode.inventoryReset === true}
                 onChange={onInventoryResetChange}/>

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
                <InputSelect
                  key={'inventory-update-assignitem-' + storyVersion + '-' + stage + '-' + inventoryUpdate.length}
                  options={[...inventoryOptions, {value: 'playingTime', text: getLocale('playing-time')}]}
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