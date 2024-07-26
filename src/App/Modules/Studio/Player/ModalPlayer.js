import {useCallback, useEffect, useMemo, useState} from 'react'
import {isAudioDefined, isImageDefined} from '../Helpers/FileHelpers.js'
import {checkConditionComparator, checkUpdateInventory} from '../Editor/Forms/StudioNodesHelpers.js'

import ModalLayout from '../../../Components/Modal/ModalLayout.js'
import ButtonIconChevronLeft from '../../../Components/Buttons/Icons/ButtonIconChevronLeft.js'
import ButtonIconChevronRight from '../../../Components/Buttons/Icons/ButtonIconChevronRight.js'
import ButtonIconChevronDown from '../../../Components/Buttons/Icons/ButtonIconChevronDown.js'
import ButtonIconChevronUp from '../../../Components/Buttons/Icons/ButtonIconChevronUp.js'
import ButtonText from '../../../Components/Buttons/Text/ButtonText.js'
import PlayerInventory from './PlayerInventory.js'

import styles from './ModalPlayer.module.scss'

const
  checkRandomIndex = (index, options) => index === -1 ? Math.floor(Math.random() * options.length) : index,

  findNextOption = (options, defaultIndex, direction, items) => {
    if(options.length === 0) {
      return -1
    }

    let
      index = defaultIndex + direction,
      initialIndex = -1

    if(direction === 0) {
      direction = 1
    }

    while (true) {
      index = index >= options.length ? 0 : (index < 0 ? options.length - 1 : index)

      const option = options[index]

      if (initialIndex === index) {
        return -1
      }

      if (initialIndex === -1) {
        initialIndex = index
      }

      if (!Array.isArray(option.conditions) || !option.conditions.length) {
        return index
      }

      const condition = option.conditions.find((c) => {
        const item = items.find((item) => item.id === c.item)
        return !checkConditionComparator(item.count, c.number, c.comparator)
      })

      if (condition === undefined) {
        return index
      }

      index += direction
    }
  },

  findNextAction = (stage, nodes, items) => {
    const action = stage === null ? nodes.startAction : stage.ok
    if (action === null || nodes.actions[action.action] === undefined) {
      return [[], 0]
    }
    const
      options = nodes.actions[action.action],
      index = findNextOption(options, checkRandomIndex(action.index, options), 0, items)

    return index < 0 ? [[], 0] : [options, index]
  }

function ModalPlayer({story, onClose}) {
  const
    [stage, setStage] = useState(),
    [actionOptions, setActionOptions] = useState([]),
    [actionIndex, setActionIndex] = useState(0),
    metadata = story.metadata,
    nodes = story.nodes,
    [items, setItems] = useState(
      () => Array.isArray(nodes.inventory) && nodes.inventory.length > 0 ? nodes.inventory : null
    ),
    resetItems = useCallback(
      () => setItems((items) => items === null ? null : items.map((item) => ({...item, count: item.initialNumber}))),
      []
    ),

    itemsGot = useMemo(() => items === null ? [] : items.filter((i) => i.count > 0 && i.display !== 2), [items]),

    image = useMemo(
      () => {
        if (stage === undefined) {
          return null
        }
        if (stage === null) {
          return metadata.newImageTitle || metadata.imageTitle
        }
        return stage.newImage || isImageDefined(stage.image, metadata.path)
      },
      [metadata, stage]
    ),

    onOk = useCallback(
      () => {
        if (stage === undefined || (stage !== null && !stage.control.ok)) {
          return
        }
        const [aOptions, aIndex] = findNextAction(stage, nodes, items)
        setActionOptions(aOptions)
        setActionIndex(aIndex)
      },
      [stage, nodes, items]
    ),

    onCancel = useCallback(
      () => {
        if (stage === undefined) {
          return
        }
        const action = stage === null ? null : stage.home
        if (action === null) {
          setActionOptions([])
          setActionIndex(0)
        } else {
          setActionOptions(nodes.actions[action.action])
          setActionIndex(checkRandomIndex(action.index, nodes.actions[action.action]))
        }
      },
      [nodes, stage]
    ),

    onLeft = useCallback(
      () => {
        if (stage === undefined || stage === null || stage.control.autoplay) {
          return
        }
        setActionIndex((i) => findNextOption(actionOptions, i, -1, items))
      },
      [actionOptions, items, stage]
    ),

    onRight = useCallback(
      () => {
        if (stage === undefined || stage === null || stage.control.autoplay) {
          return
        }
        setActionIndex((i) => findNextOption(actionOptions, i, 1, items))
      },
      [actionOptions, items, stage]
    )

  useEffect(
    () => {
      if (stage === undefined) {
        return
      }

      const audio = stage === null ?
        (metadata.newAudioTitle || metadata.audioTitle) :
        (stage.newAudio || isAudioDefined(stage.audio, metadata.path))

      if (audio === null) {
        if (stage.control.autoplay) {
          const [aOptions, aIndex] = findNextAction(stage, nodes, items)
          setActionOptions(aOptions)
          setActionIndex(aIndex)
        }
        return
      }

      const player = new Audio(audio)
      player.play()
      player.addEventListener(
        'ended',
        () => {
          if (stage === null) {
            return
          }
          if (stage.control.autoplay) {
            const [aOptions, aIndex] = findNextAction(stage, nodes, items)
            setActionOptions(aOptions)
            setActionIndex(aIndex)
          }
        }
      )
      return () => {
        player.pause()
        player.remove()
      }
    },
    [nodes, metadata, stage, items]
  )

  useEffect(
    () => {
      if (actionOptions.length === 0) {
        resetItems()
        setStage(null)
        return
      }

      const option = actionOptions[actionIndex]

      if (option === undefined) {
        resetItems()
        setStage(null)
        return
      }

      const newStage = nodes.stages[option.stage]

      if (newStage === undefined) {
        resetItems()
        setStage(null)
        return
      }

      if (Array.isArray(newStage.items) && newStage.items.length) {
        setItems((items) => {
          newStage.items.forEach((item) => {
            const itemInventory = items.find((i) => i.id === item.item)
            itemInventory.count = Math.min(Math.max(0, checkUpdateInventory(itemInventory.count, item.number, item.type)), itemInventory.maxNumber)
          })
          return [...items]
        })
      }
      setStage(newStage)
    },
    [actionIndex, actionOptions, metadata, nodes, resetItems]
  )

  return <ModalLayout className={styles.container}
                      isClosable={true}
                      onClose={onClose}>
    <div className={styles.images}>
      {image !== null && <img src={image + '?time=' + Date.now()} className={styles.imageStory} alt=""/>}
      {image !== null && itemsGot.length > 0 && <PlayerInventory items={itemsGot} story={story}/>}
    </div>
    <ul className={styles.buttons}>
      <li><ButtonIconChevronLeft className={styles.buttonLeft} onClick={onLeft}/></li>
      <li><ButtonIconChevronUp className={styles.buttonUp}/></li>
      <li><ButtonIconChevronRight className={styles.buttonRight} onClick={onRight}/></li>
      <li><ButtonIconChevronDown className={styles.buttonDown}/></li>

      <li><ButtonText className={styles.buttonX} text="X" onClick={onCancel}/></li>
      <li><ButtonText className={styles.buttonY} text="Y" onClick={onCancel}/></li>
      <li><ButtonText className={styles.buttonA} text="A" onClick={onOk}/></li>
      <li><ButtonText className={styles.buttonB} text="B" onClick={onOk}/></li>
    </ul>
  </ModalLayout>
}


export default ModalPlayer

