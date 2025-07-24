import {useCallback} from 'react'


const useDragAndDropMove = (itemKey, prefixData, styleOver, onDropCallback) => {
  const
    onDragStart = useCallback(
      (e) => {
        e.dataTransfer.setData('text/plain', e.target.innerText)
        e.dataTransfer.setData('text/html', e.target.outerHTML)
        e.dataTransfer.setData(prefixData + 'Key', itemKey)
        e.dataTransfer.effectAllowed = 'move'
      },
      [itemKey, prefixData]
    ),
    onDragEnter = useCallback((e) => e.target.classList.add(styleOver), [styleOver]),
    onDragLeave = useCallback((e) => e.target.classList.remove(styleOver), [styleOver]),
    onDragOver = useCallback(
      (e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
      },
      []
    ),
    onDrop = useCallback(
      (e) => {
        e.target.classList.remove(styleOver)
        if (e.dataTransfer.getData(prefixData + 'Key') === '') {
          return
        }
        onDropCallback(e.dataTransfer.getData(prefixData + 'Key'))
      },
      [onDropCallback, prefixData, styleOver]
    ),
    onPreventChildDraggable = useCallback(
      (e) => {
        e.preventDefault()
        e.stopPropagation()
      },
      []
    )
  return {onDragStart, onDragEnter, onDragLeave, onDragOver, onDrop, onPreventChildDraggable}
}

export {useDragAndDropMove}