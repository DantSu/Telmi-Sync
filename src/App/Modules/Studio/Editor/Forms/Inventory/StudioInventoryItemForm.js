import {useRef} from 'react'
import {useLocale} from '../../../../../Components/Locale/LocaleHooks.js'
import {useStudioStory, useStudioStoryUpdater} from '../../Providers/StudioStoryHooks.js'

import Form from '../../../../../Components/Form/Form.js'
import InputText from '../../../../../Components/Form/Input/InputText.js'
import InputImage from '../../../../../Components/Form/Input/InputImage.js'
import InputSwitch from '../../../../../Components/Form/Input/InputSwitch.js'
import ButtonsContainer from '../../../../../Components/Buttons/ButtonsContainer.js'
import ButtonIconTextPlus from '../../../../../Components/Buttons/IconsTexts/ButtonIconTextPlus.js'
import ButtonIconTextFloppyDisk from '../../../../../Components/Buttons/IconsTexts/ButtonIconTextFloppyDisk.js'
import {addInventoryItem} from '../StudioNodesHelpers.js'


function StudioInventoryItemForm({itemKey, onValidate}) {
  const
    {nodes} = useStudioStory(),
    {updateStory} = useStudioStoryUpdater(),
    {getLocale} = useLocale(),
    isSetInventory = Array.isArray(nodes.inventory),
    item = isSetInventory && typeof nodes.inventory[itemKey] === 'object' ? nodes.inventory[itemKey] : {
      name: '',
      initialNumber: 0,
      maxNumber: 1,
      counterAsBar: false,
      image: null
    },
    inventoryCount = isSetInventory ? nodes.inventory.length : 0,
    inputKey = itemKey === -1 ? inventoryCount : itemKey,
    nameRef = useRef(null),
    initialNumberRef = useRef(null),
    maxNumberRef = useRef(null),
    counterAsBarRef = useRef(null),
    imageRef = useRef(null),
    ButtonValidation = itemKey === -1 ? ButtonIconTextPlus : ButtonIconTextFloppyDisk

  return <Form>{
    (validation) => {
      return <>
        <InputText key={'studio-inventory-name-' + inputKey}
                   id="studio-inventory-name"
                   label={getLocale('name')}
                   ref={nameRef}
                   defaultValue={item.name}
                   required={true}/>
        <InputText key={'studio-inventory-number-' + inputKey}
                   id="studio-inventory-number"
                   defaultValue={item.initialNumber}
                   ref={initialNumberRef}
                   type="number"
                   step={1}
                   label={getLocale('initial-number')}
                   required={true}/>
        <InputText key={'studio-inventory-max-number-' + inputKey}
                   id="studio-inventory-max-number"
                   defaultValue={item.maxNumber}
                   ref={maxNumberRef}
                   type="number"
                   step={1}
                   label={getLocale('max-number')}
                   required={true}/>
        <InputSwitch key={'studio-inventory-counter-bar-' + inputKey}
                     id="studio-inventory-counter-bar"
                     defaultValue={item.counterAsBar}
                     ref={counterAsBarRef}
                     label={getLocale('show-item-counter-as-bar')}/>
        <InputImage key={'studio-inventory-image-' + inputKey}
                    id="studio-inventory-image"
                    defaultValue={item.newImage || item.image}
                    ref={imageRef}
                    label={getLocale('picture')}
                    width={128}
                    height={128}
                    displayScale={0.5}
                    required={true}/>
        <ButtonsContainer>
          <ButtonValidation text={getLocale(itemKey === -1 ? 'add' : 'save')}
                            rounded={true}
                            onClick={() => validation(
                              [nameRef, initialNumberRef, maxNumberRef, counterAsBarRef, imageRef],
                              (values) => {
                                updateStory((s) => {
                                  if (!Array.isArray(s.nodes.inventory)) {
                                    s.nodes.inventory = []
                                  }
                                  const editItemKey = itemKey === -1 ? addInventoryItem(s.nodes) : itemKey
                                  s.nodes.inventory[editItemKey] = {
                                    ...s.nodes.inventory[editItemKey],
                                    name: values[0],
                                    initialNumber: values[1],
                                    maxNumber: values[2],
                                    counterAsBar: values[3],
                                    newImage: values[4] || s.nodes.inventory[editItemKey].newImage,
                                  }
                                  console.log(s.nodes.inventory)
                                  return {...s}
                                })
                                typeof onValidate === 'function' && onValidate()
                              }
                            )}/>
        </ButtonsContainer>
      </>
    }
  }</Form>
}

export default StudioInventoryItemForm