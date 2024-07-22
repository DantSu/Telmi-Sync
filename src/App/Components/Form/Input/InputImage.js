import {forwardRef, useCallback, useMemo, useState} from 'react'
import {useLocale} from '../../Locale/LocaleHooks.js'
import InputLayout from './InputLayout.js'

import styles from './Input.module.scss'
import ButtonIconXMark from '../../Buttons/Icons/ButtonIconXMark.js'

function InputImage(
  {label, id, required, className, onChange, onDragOver, onDrop, defaultValue, vertical, width, height, displayScale, onDelete, ...props},
  ref
) {
  const
    {getLocale} = useLocale(),
    [imagePath, setImagePath] = useState(defaultValue),
    onChangeCallback = useCallback(
      (e) => {
        if (!e.target.files.length || e.target.files[0].type.indexOf('image/') !== 0) {
          e.target.value = null
        } else {
          setImagePath(e.target.files[0].path)
          typeof onChange === 'function' && onChange(e.target.files[0].path)
        }
      },
      [onChange]
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
    ),
    refCallback = useCallback(
      (r) => {
        if (r !== null && ref !== null) {
          r.checkValue = () => {
            if (r.required && (typeof imagePath !== 'string' || imagePath === '')) {
              return getLocale('input-required', label)
            }
            return null
          }
          r.getValue = () => {
            if (r.files.length && r.files[0].type.indexOf('image/') === 0) {
              return r.files[0].path
            }
            return null
          }
          ref.current = r
        }
      },
      [ref, label, getLocale, imagePath]
    ),
    labelComponent = useMemo(
      () => <>{label} {!vertical && <br/>} ({width}*{height}px)</>,
      [label, width, height, vertical]
    )

  return <InputLayout label={labelComponent}
                      id={id}
                      required={required}
                      vertical={vertical}
                      className={vertical ? styles.containerVertical : undefined}>
    <div className={[styles.inputImageLayout, vertical ? styles.inputImageLayoutVertical : ''].join(' ')}
         style={{width: (width * displayScale) + 'px', height: (height * displayScale) + 'px'}}>
      <div className={styles.inputImageContainer}>
        <input {...props}
               type="file"
               accept=".jpg, .jpeg, .png, .bmp, .gif"
               onChange={onChangeCallback}
               onDragOver={onDragOverCallback}
               onDrop={onDropCallback}
               className={[styles.inputImage, className].join(' ')}
               required={required}
               id={id}
               ref={refCallback}/>
        {imagePath && <img src={imagePath + '?time=' + Date.now()} className={styles.inputImageImg} alt=""/>}
      </div>
      {imagePath && onDelete && <ButtonIconXMark className={styles.deleteButton}
                                                 rounded={true}
                                                 title={getLocale('delete-image')}
                                                 onClick={() => {
                                                   setImagePath(null)
                                                   typeof onDelete === 'function' && onDelete()
                                                 }}/>}
    </div>

  </InputLayout>
}

export default forwardRef(InputImage)
