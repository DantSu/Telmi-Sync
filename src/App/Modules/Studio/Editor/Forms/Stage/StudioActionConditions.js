import {useRef} from 'react'
import {useLocale} from '../../../../../Components/Locale/LocaleHooks.js'
import {useStudioStory, useStudioStoryUpdater} from '../../Providers/StudioStoryHooks.js'
import {useStudioForm} from '../../Providers/StudioStageHooks.js'
import {getConditionComparator} from '../StudioNodesHelpers.js'

import Form from '../../../../../Components/Form/Form.js'
import InputSelect from '../../../../../Components/Form/Input/InputSelect.js'
import InputText from '../../../../../Components/Form/Input/InputText.js'
import StudioActionCondition from './StudioActionCondition.js'
import ButtonIconPlus from '../../../../../Components/Buttons/Icons/ButtonIconPlus.js'

import styles from './StudioStageForm.module.scss'

function StudioActionConditions({action, actionPosition, ...props}) {
  const
    {getLocale} = useLocale(),
    {nodes} = useStudioStory(),
    {form: stage} = useStudioForm(),
    {updateStory} = useStudioStoryUpdater(),

    comparatorRef = useRef(null),
    numberRef = useRef(null),
    itemRef = useRef(null),

    conditions = Array.isArray(action.conditions) ? action.conditions : [],

    onValidate = (values) => updateStory((s) => {
      if (!Array.isArray(action.conditions)) {
        action.conditions = []
      }
      action.conditions.push({item: values[2], number: values[1], comparator: values[0]})
      return {
        ...s,
        nodes: {...s.nodes}
      }
    })

  return <ul{...props}
            className={styles.conditionsContainer}>
    {conditions.map((c, k) => <StudioActionCondition key={'action-condition-' + actionPosition + '-' + k}
                                                     action={action}
                                                     condition={c}
                                                     conditionKey={k}/>)}
    <li className={styles.conditionFormContainer}
        key={'action-condition-form-' + actionPosition + '-' + stage}>
      <Form className={styles.conditionForm}>{
        (validation) => {
          return <>
            <h3 className={styles.conditionTitle}>{getLocale('display-conditions')}:</h3>
            <div className={styles.conditionInputSmall}>
              <InputSelect key={'action-condition-comparator-' + stage + '-' + actionPosition + '-' + conditions.length}
                           options={getConditionComparator().map((text, value) => ({value, text}))}
                           ref={comparatorRef}
                           vertical={true}/>
            </div>
            <div className={styles.conditionInputMedium}>
              <InputText key={'action-condition-number-' + stage + '-' + actionPosition + '-' + conditions.length}
                         ref={numberRef}
                         type="number"
                         step={1}
                         defaultValue={0}
                         vertical={true}/>
            </div>
            <div className={styles.conditionInputWide}>
              <InputSelect key={'action-condition-item-' + stage + '-' + actionPosition + '-' + conditions.length}
                           ref={itemRef}
                           options={nodes.inventory.map((v) => ({value: v.id, text: v.name}))}
                           vertical={true}/>
            </div>
            <ButtonIconPlus rounded={true}
                            title={getLocale('add-display-condition')}
                            onClick={() => validation([comparatorRef, numberRef, itemRef], onValidate)}/>
          </>
        }
      }</Form>
    </li>
  </ul>
}

export default StudioActionConditions