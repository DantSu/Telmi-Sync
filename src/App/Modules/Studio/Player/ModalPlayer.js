import {useCallback, useEffect, useMemo, useState} from 'react'
import {isAudioDefined, isImageDefined} from '../Helpers/FileHelpers.js'
import {doComparisonOperator, doAssignmentOperator} from '../Editor/Forms/StudioNodesHelpers.js'

import ModalLayout from '../../../Components/Modal/ModalLayout.js'
import ButtonIconChevronLeft from '../../../Components/Buttons/Icons/ButtonIconChevronLeft.js'
import ButtonIconChevronRight from '../../../Components/Buttons/Icons/ButtonIconChevronRight.js'
import ButtonIconChevronDown from '../../../Components/Buttons/Icons/ButtonIconChevronDown.js'
import ButtonIconChevronUp from '../../../Components/Buttons/Icons/ButtonIconChevronUp.js'
import ButtonText from '../../../Components/Buttons/Text/ButtonText.js'
import PlayerInventory from './PlayerInventory.js'

import styles from './ModalPlayer.module.scss'

const
  getTime = () => Math.floor(Date.now() / 1000),
  getConditionNumber = (condition, items) => {
    if (condition.number !== undefined) {
      return condition.number
    }
    if (condition.compareItem !== undefined) {
      return items.find((item) => item.id === condition.compareItem).count
    }
    return 0
  },
  getInventoryUpdateNumber = (update, items, startPlayingTime) => {
    if (update.number !== undefined) {
      return update.number
    }
    if (update.assignItem !== undefined) {
      return items.find((item) => item.id === update.assignItem).count
    }
    if (update.playingTime) {
      return getTime() - startPlayingTime
    }
    return 0
  },
  getIndex = (action, options, items) => {
    if (!options.length || (action.index === undefined && action.indexItem === undefined)) {
      return 0
    }
    if (action.indexItem !== undefined) {
      return Math.min(Math.max(items.find((item) => item.id === action.indexItem).count, 0), options.length - 1)
    }
    if (action.index >= 0) {
      return action.index
    }
    if (!Array.isArray(items) || !items.length) {
      return Math.floor(Math.random() * options.length)
    }
    const optionsSelected = options.filter(
      (option) => {
        if (!Array.isArray(option.conditions) || !option.conditions.length) {
          return true
        }
        return option.conditions.find(
          (c) => !doComparisonOperator(
            items.find((item) => item.id === c.item).count,
            getConditionNumber(c, items),
            c.comparator
          )
        ) === undefined
      }
    )
    const option = optionsSelected[Math.floor(Math.random() * optionsSelected.length)]
    return options.findIndex((o) => o === option)
  },

  findNextOption = (options, defaultIndex, direction, items) => {
    if (options.length === 0) {
      return -1
    }

    let
      index = defaultIndex + direction,
      initialIndex = -1

    if (direction === 0) {
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
        return !doComparisonOperator(item.count, getConditionNumber(c, items), c.comparator)
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
      index = findNextOption(options, getIndex(action, options, items), 0, items)

    return index < 0 ? [[], 0] : [options, index]
  }

function ModalPlayer({story, onClose}) {
  const
    [stage, setStage] = useState(),
    [startPlayingTime, setStartPlayingTime] = useState(getTime()),
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
        if (stage === null) {
          setStartPlayingTime(getTime())
        }
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
          setActionIndex(getIndex(action, nodes.actions[action.action], items))
        }
      },
      [items, nodes.actions, stage]
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

      if (newStage.inventoryReset) {
        setItems((items) => items.map((item) => ({
          ...item,
          count: item.initialNumber
        })))
      }

      if (Array.isArray(newStage.items) && newStage.items.length) {
        setItems((items) => {
          newStage.items.forEach((item) => {
            const itemInventory = items.find((i) => i.id === item.item)
            itemInventory.count = Math.min(Math.max(0, doAssignmentOperator(itemInventory.count, getInventoryUpdateNumber(item, items, startPlayingTime), item.type)), itemInventory.maxNumber)
          })
          return [...items]
        })
      }
      setStage(newStage)
    },
    [actionIndex, actionOptions, metadata, nodes, resetItems, startPlayingTime]
  )

  return <ModalLayout className={styles.container}
                      isClosable={true}
                      onClose={onClose}>
    <div className={styles.images}>
      {image && <img src={encodeURI(image.replaceAll('\\', '/')) + '?time=' + Date.now()} className={styles.imageStory}
                     alt=""/>}
      {image && itemsGot.length > 0 && <PlayerInventory items={itemsGot} story={story}/>}
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

