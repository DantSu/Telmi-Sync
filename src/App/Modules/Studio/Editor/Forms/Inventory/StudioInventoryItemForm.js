import {useRef} from 'react'
import {useLocale} from '../../../../../Components/Locale/LocaleHooks.js'
import {useStudioStory, useStudioStoryUpdater} from '../../Providers/StudioStoryHooks.js'
import {addInventoryItem} from '../StudioNodesHelpers.js'

import Form from '../../../../../Components/Form/Form.js'
import InputText from '../../../../../Components/Form/Input/InputText.js'
import InputImage from '../../../../../Components/Form/Input/InputImage.js'
import ButtonsContainer from '../../../../../Components/Buttons/ButtonsContainer.js'
import ButtonIconTextPlus from '../../../../../Components/Buttons/IconsTexts/ButtonIconTextPlus.js'
import ButtonIconTextFloppyDisk from '../../../../../Components/Buttons/IconsTexts/ButtonIconTextFloppyDisk.js'
import InputSelect from '../../../../../Components/Form/Input/InputSelect.js'


function StudioInventoryItemForm({itemKey, onValidate}) {
  const
    {story: {metadata, nodes}, storyVersion} = useStudioStory(),
    {updateStory} = useStudioStoryUpdater(),
    {getLocale} = useLocale(),
    isSetInventory = Array.isArray(nodes.inventory),
    item = isSetInventory && typeof nodes.inventory[itemKey] === 'object' ? nodes.inventory[itemKey] : {
      name: '',
      initialNumber: 0,
      maxNumber: 1,
      display: 0,
      image: null
    },
    inventoryCount = isSetInventory ? nodes.inventory.length : 0,
    inputKey = itemKey === -1 ? inventoryCount : itemKey,
    nameRef = useRef(null),
    initialNumberRef = useRef(null),
    maxNumberRef = useRef(null),
    displayRef = useRef(null),
    imageRef = useRef(null),
    ButtonValidation = itemKey === -1 ? ButtonIconTextPlus : ButtonIconTextFloppyDisk

  return <Form>{
    (validation) => {
      return <>
        <InputText key={'studio-inventory-name-' + storyVersion + '-' + inputKey}
                   id="studio-inventory-name"
                   label={getLocale('name')}
                   ref={nameRef}
                   defaultValue={item.name}
                   required={true}/>
        <InputText key={'studio-inventory-number-' + storyVersion + '-' + inputKey}
                   id="studio-inventory-number"
                   defaultValue={item.initialNumber}
                   ref={initialNumberRef}
                   type="number"
                   step={1}
                   min={0}
                   label={getLocale('initial-number')}
                   required={true}/>
        <InputText key={'studio-inventory-max-number-' + storyVersion + '-' + inputKey}
                   id="studio-inventory-max-number"
                   defaultValue={item.maxNumber}
                   ref={maxNumberRef}
                   type="number"
                   step={1}
                   min={1}
                   label={getLocale('max-number')}
                   required={true}/>
        <InputSelect key={'studio-inventory-display-' + storyVersion + '-' + inputKey}
                     id="studio-display-bar"
                     defaultValue={item.display}
                     ref={displayRef}
                     options={[
                       {value: 0, text: getLocale('display-number')},
                       {value: 1, text: getLocale('display-bar')},
                       {value: 2, text: getLocale('display-none')}
                     ]}
                     label={getLocale('display')}/>
        <InputImage key={'studio-inventory-image-' + storyVersion + '-' + inputKey}
                    id="studio-inventory-image"
                    defaultValue={item.newImage || (item.image ? metadata.path + '/images/' + item.image : undefined)}
                    ref={imageRef}
                    label={getLocale('picture')}
                    width={128}
                    height={128}
                    displayScale={0.5}/>
        <ButtonsContainer>
          <ButtonValidation text={getLocale(itemKey === -1 ? 'add' : 'save')}
                            rounded={true}
                            onClick={() => validation(
                              [nameRef, initialNumberRef, maxNumberRef, displayRef, imageRef],
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
                                    display: values[3],
                                    newImage: values[4] || s.nodes.inventory[editItemKey].newImage,
                                  }
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