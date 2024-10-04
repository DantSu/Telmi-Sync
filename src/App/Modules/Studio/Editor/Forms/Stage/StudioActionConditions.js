import {useRef, useState} from 'react'
import {useLocale} from '../../../../../Components/Locale/LocaleHooks.js'
import {useStudioForm} from '../../Providers/StudioStageHooks.js'
import {useStudioStory, useStudioStoryUpdater} from '../../Providers/StudioStoryHooks.js'
import {getComparisonOperators} from '../StudioNodesHelpers.js'

import Form from '../../../../../Components/Form/Form.js'
import InputSelect from '../../../../../Components/Form/Input/InputSelect.js'
import InputText from '../../../../../Components/Form/Input/InputText.js'
import StudioActionCondition from './StudioActionCondition.js'
import ButtonIconPlus from '../../../../../Components/Buttons/Icons/ButtonIconPlus.js'

import styles from './StudioStageForm.module.scss'

function StudioActionConditions({action, actionPosition, ...props}) {
  const
    {getLocale} = useLocale(),
    {form: stage} = useStudioForm(),
    {story: {nodes}, storyVersion} = useStudioStory(),
    {updateStory} = useStudioStoryUpdater(),

    itemRef = useRef(null),
    comparatorRef = useRef(null),
    typeValueRef = useRef(null),
    numberRef = useRef(null),
    compareItemRef = useRef(null),
    [typeValue, setTypeValue] = useState(0),

    conditions = Array.isArray(action.conditions) ? action.conditions : [],

    onValidate = (values) => updateStory((s) => {
      if (!Array.isArray(action.conditions)) {
        action.conditions = []
      }
      setTypeValue(0)
      action.conditions.push(
        values[2] === 0 ?
          {item: values[0], number: values[3], comparator: values[1]} :
          {item: values[0], compareItem: values[4], comparator: values[1]}
      )
      return {
        ...s,
        nodes: {...s.nodes}
      }
    }),

    inventoryOptions = nodes.inventory.map((v) => ({value: v.id, text: v.name}))

  return <ul{...props}
            className={styles.conditionsContainer}>
    {conditions.map((c, k) => <StudioActionCondition key={'action-condition-' + actionPosition + '-' + k}
                                                     action={action}
                                                     condition={c}
                                                     conditionKey={k}/>)}
    <li className={styles.conditionFormContainer} key={'action-condition-form-' + actionPosition}>
      <Form className={styles.conditionForm}>{
        (validation) => {
          return <>
            <h3 className={styles.conditionTitle}>{getLocale('add-condition')}:</h3>
            <div className={styles.conditionInputWide}>
              <InputSelect
                key={'action-condition-item-' + storyVersion + '-' + stage + '-' + actionPosition + '-' + conditions.length}
                ref={itemRef}
                options={inventoryOptions}
                vertical={true}/>
            </div>
            <div className={styles.conditionInputSmall}>
              <InputSelect
                key={'action-condition-comparator-' + storyVersion + '-' + stage + '-' + actionPosition + '-' + conditions.length}
                options={getComparisonOperators().map((text, value) => ({value, text}))}
                ref={comparatorRef}
                vertical={true}/>
            </div>
            <div className={styles.conditionInputSmall}>
              <InputSelect
                key={'action-condition-typevalue-' + storyVersion + '-' + stage + '-' + actionPosition + '-' + conditions.length}
                options={[{value: 0, text: 'Nbr.'}, {value: 1, text: 'Obj.'}]}
                onChange={(value) => setTypeValue(value)}
                ref={typeValueRef}
                vertical={true}/>
            </div>
            {
              typeValue === 0 ?
                <div className={styles.conditionInputWide}>
                  <InputText
                    key={'action-condition-number-' + storyVersion + '-' + stage + '-' + actionPosition + '-' + conditions.length}
                    ref={numberRef}
                    type="number"
                    step={1}
                    min={0}
                    defaultValue={0}
                    required={true}
                    vertical={true}/>
                </div> :
                <div className={styles.conditionInputWide}>
                  <InputSelect
                    key={'action-condition-compareitem-' + storyVersion + '-' + stage + '-' + actionPosition + '-' + conditions.length}
                    ref={compareItemRef}
                    options={inventoryOptions}
                    vertical={true}/>
                </div>
            }
            <div className={styles.conditionInputTiny}>
              <ButtonIconPlus rounded={true}
                              title={getLocale('add-display-condition')}
                              className={styles.buttonValidate}
                              onClick={() => validation([itemRef, comparatorRef, typeValueRef, numberRef, compareItemRef], onValidate)}/>
            </div>
          </>
        }
      }</Form>
    </li>
  </ul>
}

export default StudioActionConditions