import {forwardRef, useCallback, useState} from 'react'
import {useLocale} from '../../Locale/LocaleHooks.js'
import InputLayout from './InputLayout.js'

import styles from './Input.module.scss'

function InputImage({label, id, required, className, onChange, image, ...props}, ref) {
  const
    {getLocale} = useLocale(),
    [imagePath, setImagePath] = useState(image),
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
    refCallback = useCallback(
      (r) => {
        if (r !== null && ref !== null) {
          r.checkValue = () => {
            if (r.required && r.value === '') {
              return getLocale('input-required', label)
            }
            return null
          }
          ref.current = r
        }
      },
      [ref, label, getLocale]
    )

  return <InputLayout label={label}
                      id={id}
                      required={required}
                      className={styles.containerVertical}>
    <div className={styles.inputImageContainer}>
      <input {...props}
             type="file"
             accept=".jpg, .jpeg, .png, .bmp, .gif"
             onChange={onChangeCallback}
             className={[styles.inputImage, className].join(' ')}
             required={required}
             id={id}
             ref={refCallback}/>
      {imagePath && <img src={imagePath} className={styles.inputImageImg} alt=""/>}
    </div>
  </InputLayout>
}

export default forwardRef(InputImage)
