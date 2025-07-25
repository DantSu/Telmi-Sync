import {useCallback, useMemo} from 'react'
import {useDragAndDropMove} from '../../../../Components/Form/DragAndDrop/DragAndDropMoveHook.js'
import {isIntArraysEquals} from '../../../../Helpers/Array.js'
import {findElementInAudioList, getElementInAudioList, insertAudioItems, removeAudioItem} from './Provider/StoreBuilderHelpers.js'

import styles from './StoreAudioList.module.scss'

const useStoreAudioBuilderDragAndDrop = (audioListKeys, setAudioList) => {
  const
    dragKeys = useMemo(() => JSON.stringify(audioListKeys), [audioListKeys]),
    onDropCallback = useCallback(
      (dragItemKeysStr) => {
        const dragItemKeys = JSON.parse(dragItemKeysStr)
        if (dragItemKeys.length <= audioListKeys.length && isIntArraysEquals(dragItemKeys, audioListKeys.slice(0, dragItemKeys.length))) {
          return
        }
        setAudioList((audioList) => {
          const
            parentDragItemKeys = dragItemKeys.slice(0, dragItemKeys.length - 1),
            parentAudioListKeys = audioListKeys.slice(0, audioListKeys.length - 1),
            sameParent = isIntArraysEquals(parentDragItemKeys, parentAudioListKeys),
            parentElementTarget = getElementInAudioList(audioList, [...parentAudioListKeys]),
            dropDown = (sameParent && audioListKeys[audioListKeys.length - 1] > dragItemKeys[dragItemKeys.length - 1]) ||
              (!sameParent && audioListKeys[audioListKeys.length - 1] === (parentElementTarget.audio.length - 1)),
            element = getElementInAudioList(audioList, [...dragItemKeys]),
            elementTarget = getElementInAudioList(audioList, [...audioListKeys]),
            audioListTmp = removeAudioItem(audioList, [...dragItemKeys]),
            newAudioListKeys = findElementInAudioList(audioListTmp, elementTarget)
          return insertAudioItems(
              audioListTmp,
              newAudioListKeys.slice(0, newAudioListKeys.length - 1),
              newAudioListKeys[newAudioListKeys.length - 1] + (dropDown ? 1 : 0),
              [element]
            )
        })
      },
      [audioListKeys, setAudioList]
    )

  return useDragAndDropMove(dragKeys, 'StoreAudioBuilder', styles.storeBuilderDragOver, onDropCallback)
}

export {useStoreAudioBuilderDragAndDrop}