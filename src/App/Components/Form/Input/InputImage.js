import {forwardRef, useCallback, useMemo, useState} from 'react'
import {useLocale} from '../../Locale/LocaleHooks.js'
import InputLayout from './InputLayout.js'
import ButtonIconXMark from '../../Buttons/Icons/ButtonIconXMark.js'
import InputDropFile from './InputDropFile.js'

import styles from './Input.module.scss'

function InputImage(
  {
    label,
    id,
    required,
    className,
    classNameInput,
    onChange,
    onDragOver,
    onDrop,
    defaultValue,
    vertical,
    width,
    height,
    displayScale,
    onDelete,
    ...props
  },
  ref
) {
  const
    {getLocale} = useLocale(),
    [imagePath, setImagePath] = useState(defaultValue),
    onChangeCallback = useCallback(
      (path) => {
        setImagePath(path)
        typeof onChange === 'function' && onChange(path)
      },
      [onChange]
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
            if (r.files.length && r.files[0].type.indexOf('image/') === 0 && typeof imagePath === 'string' && imagePath !== '') {
              return imagePath
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
                      className={[vertical ? styles.containerVertical : undefined, className].join(' ')}>
    <div className={[styles.inputImageLayout, vertical ? styles.inputImageLayoutVertical : ''].join(' ')}
         style={{width: (width * displayScale) + 'px', height: (height * displayScale) + 'px'}}>
      <div className={styles.inputImageContainer}>
        <InputDropFile {...props}
                       mimeStart="image/"
                       accept=".jpg, .jpeg, .png, .bmp, .gif, .webp, .avif"
                       onChange={onChangeCallback}
                       onDragOver={onDragOver}
                       onDrop={onDrop}
                       className={classNameInput}
                       required={required}
                       id={id}
                       ref={refCallback}/>
        {imagePath &&
          <img src={encodeURI(imagePath.replaceAll('\\', '/')) + '?time=' + Date.now()}
               className={styles.inputImageImg}
               alt=""/>}
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
