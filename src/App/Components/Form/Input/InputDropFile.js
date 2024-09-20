import {forwardRef, useCallback} from 'react'
import {useModal} from '../../Modal/ModalHooks.js'
import {useElectronListener} from '../../Electron/Hooks/UseElectronEvent.js'
import ModalElectronTaskVisualizer from '../../Electron/Modal/ModalElectronTaskVisualizer.js'

import styles from './Input.module.scss'

function InputDropFile({id, accept, mimeStart, required, className, onChange, onDragOver, onDrop, ...props}, refCallback) {
  const
    {addModal, rmModal} = useModal(),
    onChangeCallback = useCallback(
      (e) => {
        if (!e.target.files.length || e.target.files[0].type.indexOf(mimeStart) !== 0) {
          e.target.value = null
        } else {
          addModal((key) => {
            const modal = <ModalElectronTaskVisualizer key={key}
                                                       taskName="file-copy"
                                                       dataSent={[e.target.files[0].path]}
                                                       onClose={() => rmModal(modal)}/>
            return modal
          })
        }
      },
      [addModal, mimeStart, rmModal]
    ),
    onDragOverCallback = useCallback(
      (e) => {
        e.stopPropagation()
        typeof onDragOver === 'function' && onDragOver(e)
      },
      [onDragOver]
    ),
    onDropCallback = useCallback(
      (e) => {
        e.stopPropagation()
        typeof onDrop === 'function' && onDrop(e)
      },
      [onDrop]
    )
  
  useElectronListener(
    'file-copy-succeed',
    (filePath) => {
      typeof onChange == 'function' && onChange(filePath)
    },
    [onChange]
  )
  
  return <input {...props}
                type="file"
                accept={accept}
                onChange={onChangeCallback}
                onDragOver={onDragOverCallback}
                onDrop={onDropCallback}
                className={[styles.inputFile, className].join(' ')}
                required={required}
                id={id}
                ref={refCallback}/>
}

export default forwardRef(InputDropFile)