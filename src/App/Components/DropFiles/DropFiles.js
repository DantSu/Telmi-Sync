import { useEffect, useRef, useState } from 'react'
import DropArea from './DropArea.js'

const {webUtils} = window.require('electron')

function DropFiles ({children, onFilesDropped}) {
  const
    [isOver, setOver] = useState(false),
    refDropArea = useRef()

  useEffect(() => {
    const
      dragover = e => {
        e.preventDefault()
        e.stopPropagation()
        setOver(true)
      },
      drop = e => {
        e.preventDefault()
        e.stopPropagation()
        if (e.dataTransfer.files.length) {
          onFilesDropped(Object.values(e.dataTransfer.files).map(v => webUtils.getPathForFile(v)))
        }
        setOver(false)
      },
      leave = e => {
        e.preventDefault()
        e.stopPropagation()
        setOver(false)
      },
      end = e => {
        e.preventDefault()
        e.stopPropagation()
        setOver(false)
      },
      dropArea = refDropArea.current

    document.addEventListener('dragover', dragover)
    if (dropArea !== undefined) {
      dropArea.addEventListener('dragover', dragover)
      dropArea.addEventListener('drop', drop)
      dropArea.addEventListener('dragleave', leave)
      dropArea.addEventListener('dragend', end)
    }
    return () => {
      document.removeEventListener('dragover', dragover)
      if (dropArea !== undefined) {
        dropArea.removeEventListener('dragover', dragover)
        dropArea.removeEventListener('drop', drop)
        dropArea.removeEventListener('dragleave', leave)
        dropArea.removeEventListener('dragend', end)
      }
    }
  }, [refDropArea, setOver, onFilesDropped])
  return <>
    {children}
    <DropArea ref={refDropArea} isOver={isOver}/>
  </>
}

export default DropFiles
